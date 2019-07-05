# Svelte Toolbox

A UI component library for Svelte implementing Google's Material Design specification.

Beacuse Svelte Toolbox is early in development, some things may change before we hit `v1.0.0` (Please see [Component Status](#component-status)).

## Contributing

Pull requests are always welcome!

```bash
git clone https://github.com/svelte-toolbox/svelte-toolbox.git
cd svelte-toolbox
npm install
```

To start the development server:

```bash
npm run dev
```

To clean up the project and format the files:

```bash
npm run lint
```

You are welcome to add new features or components, but please open an issue to discuss your idea first.

## Usage

```shell
npm i svelte-toolbox
```

Not all of these components are stable. Please see the [Component Status](#component-status) section.

There is detailed documentation about each of the components [below](#documentation), but the basic usage looks like this:

```html
<script>
	import { UIButton, Ripple } from 'svelte-toolbox';
</script>

<UIButton on:click="{() => alert('done!')}">Click me!</UIButton>

<Ripple>
	There is a nice ripple effect on this text.
</Ripple>
```

### Global Styles

We recommend adding these lines to your global stylesheet. These will be the default styles for the components you import from `svelte-toolbox`.

```css
:root {
	/* buttons */
	--buttons: #303ba6;
	--primary-buttons-text-color: white;
	--buttons-hover-color: #303ca649;
	--primary-buttons-hover-color: var(--buttons);
	--buttons-ripple-color: #303ca69d;
	--primary-buttons-ripple-color: rgba(255, 255, 255, 0.5);

	/* inputs */
	--inputs: var(--buttons);
	--inputs-background: #ecebeb;
	--inputs-background-hover: #ebebeb;
	--inputs-background-focus: #e7e4e4;
	--inputs-placeholder: #696969;
	--inputs-outline: grey;
	--inputs-outline-hover: var(--inputs-outline);

	/* switch */
	--switch-on-color: green;
	--switch-off-color: #ddd;
	--switch-on-color-track: rgba(16, 122, 4, 0.5);
	--switch-off-color-track: #aaa;
	--switch-active-color: rgba(0, 0, 0, 0.01);
	--switch-hover-color: rgba(0, 0, 0, 0.07);
	--switch-hover-on-color: rgba(16, 112, 4, 0.07);

	/* IconButtons */
	--icon-buttons: var(--buttons);
	--icon-buttons-hover: rgba(0, 0, 0, 0.07);
	--icon-buttons-active: rgba(0, 0, 0, 0.1);
	--icon-buttons-ripple: rgba(0, 0, 0, 0.2);

	/* error */
	--all-errors: #b00020;
}
.button-disabled {
	opacity: 0.4;
	cursor: not-allowed;
}
```

### Icons

Svelte Toolbox expects to find a [`icons.woff2`](https://github.com/svelte-toolbox/svelte-toolbox/blob/master/public/icons.woff2) in the same directory as the hosting file (usually `index.html`).

To get the Material Design Icons to work:

-   Download [`icons.woff2`](https://github.com/svelte-toolbox/svelte-toolbox/blob/master/public/icons.woff2)
-   For most projects place the downloaded file is the same directory as your hosting file, which would be:
    -   `public/` for a Svelte project
    -   `static/` for a Sapper project

### Component Status

| Component                                                                                                       | Status                                                                                                     |
| :-------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| [Ripple](https://github.com/svelte-toolbox/svelte-toolbox/tree/master/src/components/ripple/README.md)          | **Stable**, no breaking changes or new features are expected.                                              |
| [UIButton](https://github.com/svelte-toolbox/svelte-toolbox/tree/master/src/components/button/README.md)        | **Stable**, in that no breaking chenges are expected, but new features are.                                |
| [UIInput](https://github.com/svelte-toolbox/svelte-toolbox/tree/master/src/components/input/README.md)          | **Mostly Stable**, there is some improvment under the hood to be done. This _might_ effect the public API. |
| [IconButton](https://github.com/svelte-toolbox/svelte-toolbox/tree/master/src/components/icon-button/README.md) | **Stable**. Although new features are expected, no breaking changes are.                                   |
| [Switch](https://github.com/svelte-toolbox/svelte-toolbox/tree/master/src/components/switch/README.md)          | **Unfinished**. This component is still in progress.                                                       |

### Documentation

Some of these components are still unstable. Please see the [Component Status](#component-status) section.

-   [Ripple](https://github.com/svelte-toolbox/svelte-toolbox/tree/master/src/components/ripple/README.md)
-   [UIButton](https://github.com/svelte-toolbox/svelte-toolbox/tree/master/src/components/button/README.md)
-   [UIInput](https://github.com/svelte-toolbox/svelte-toolbox/tree/master/src/components/input/README.md)
-   [IconButton](https://github.com/svelte-toolbox/svelte-toolbox/tree/master/src/components/icon-button/README.md)

## Inspiration

As I was working on an app using [Sapper](http://sapper.dev), I was made made aware of the fact that if there was a UI component library out there for [Svelte](http://svelte.dev), it would make developing a Svelte app so much easier!

I am a big fan of the Google Material Design patterns, and because I really like [React Toolbox](https://github.com/react-toolbox/react-toolbox), I decided to make something like it for Svelte.

## License

[MIT](https://github.com/svelte-toolbox/svelte-toolbox/blob/master/LICENSE)
