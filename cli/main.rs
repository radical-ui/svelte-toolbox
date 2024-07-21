mod bundle;
mod collect;
mod convert;
mod gen_js_entry;
mod gen_rust;
mod module_loader;
mod print;

use anyhow::{bail, Context, Result};
use bundle::Bundler;
use clap::{Parser, Subcommand, ValueEnum};
use collect::Collection;
use colored::{Color, Colorize};
use deno_graph::source::MemoryLoader;
use env_logger::Env;
use gen_js_entry::gen_js_entry;
use gen_rust::RustGen;
use log::{error, Level, LevelFilter};
use module_loader::load_modules;
use std::{env::current_dir, io::Write, path::PathBuf};
use tokio::{fs::write, runtime::Builder};
use url::Url;

#[derive(Debug, ValueEnum, Clone, Default)]
enum Platform {
	Ios,
	Android,
	Macos,
	Linux,
	Windows,
	#[default]
	Web,
}

impl ToString for Platform {
	fn to_string(&self) -> String {
		self.to_possible_value().unwrap().get_name().to_string()
	}
}

#[derive(Debug, ValueEnum, Clone)]
enum Engine {
	Rust,
}

impl Engine {
	fn get_bindings(&self, collection: &Collection) -> String {
		match self {
			Self::Rust => {
				let mut gen = RustGen::new(collection);
				gen.gen();

				gen.get_output()
			}
		}
	}
}

#[derive(Parser, Debug, Clone)]
struct Command {
	/// The runtime to use. Can be a path or a full url
	#[arg(long)]
	runtime: String,

	/// The platform to build for. Defaults to `web`.
	#[arg(long, default_value_t = Default::default())]
	platform: Platform,

	/// The engine that the componet trees will be built in.
	#[arg(long)]
	engine: Engine,

	/// The path that engine bindings should be written to.
	#[arg(long)]
	bindings_path: PathBuf,

	/// The url that the engine will be running at. Can be a websocket or http url.
	#[arg(long, default_value_t = Url::parse("http://localhost:5000").unwrap())]
	engine_url: Url,

	/// The type of operation to run
	#[command(subcommand)]
	operation: Operation,
}

#[derive(Subcommand, Debug, Clone)]
enum Operation {
	/// Run the application using the configured runtime (see --runtime) and platform (see --platform). Engine is expected to be
	/// already running at the configured engine url
	Run {
		/// Watch the runtime code and reload application if it is updated. Should only be necessary if you are working on the
		/// runtime.
		#[arg(long)]
		watch_runtime: bool,

		/// Watch the engine and reload if it is restarted.
		#[arg(long)]
		reload: bool,
	},
	/// Build the configured runtime (see --runtime) for the configured platform (see --platform), which, when run, will access the
	/// engine at the configured engine url (see --engine-url). Each platform and runtime will be nested inside the folder.
	// For example, if you set this to "out", a build with "--runtime=preact --platform=web" would be written to `out/web_preact`
	Build {
		#[arg(long, default_value_t = String::from("target"))]
		out_dir: String,
	},
}

fn main() {
	env_logger::Builder::from_env(Env::default().default_filter_or("info"))
		.filter_level(LevelFilter::Info)
		.format(|buf, record| {
			writeln!(
				buf,
				"{}{} {}",
				record.level().to_string().to_lowercase().bold().color(match record.level() {
					Level::Error => Color::Red,
					Level::Warn => Color::Yellow,
					Level::Info => Color::Green,
					Level::Debug => Color::Blue,
					Level::Trace => Color::Cyan,
				}),
				":".bold().white(),
				record.args()
			)
		})
		.try_init()
		.unwrap();

	Builder::new_current_thread().enable_all().build().unwrap().block_on(async {
		match main_async().await {
			Ok(_) => (),
			Err(err) => error!("{:?}", err),
		}
	});
}

async fn main_async() -> Result<()> {
	let args = Command::parse();
	let base_url = Url::from_directory_path(current_dir().context("Failed to get the current working directory")?).unwrap();
	let runtime_url = base_url.join(&args.runtime).context("Failed to resolve runtime entry")?;
	let mut memory_loader = MemoryLoader::default();
	let mut bundler = Bundler::default();
	let mut collection = Collection::default();

	load_modules(&runtime_url, &mut memory_loader, &mut bundler).await?;

	collection.collect(&runtime_url, &memory_loader).await?;
	collection.check_components();

	let errors = collection.get_errors();
	let error_count = errors.len();

	for error in errors {
		error!("{:?}", error);
	}

	if error_count > 0 {
		bail!(
			"could not mount runtime due to {} previous error{}",
			error_count,
			if error_count == 1 { "" } else { "s" }
		);
	}

	let response = bundler.bundle(gen_js_entry(&runtime_url, &args.engine_url, &collection)?).await?;
	write("bundle.js", response).await?;

	let bindings = args.engine.get_bindings(&collection);
	write(args.bindings_path, bindings).await?;

	Ok(())
}
