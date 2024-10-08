import { ComponentRender } from './component.tsx'
import { Component, React } from './deps.ts'
import { LabelRender } from './label.tsx'

/**
 * TODO
 *
 * **Example**
 *
 * ```rust Center::new().body(Label::new("Hello, World!")) ```
 *
 * @component
 */
export interface Center {
	body?: Component
}

export function CenterRender(props: Center) {
	return (
		<div class='w-full h-full flex items-center justify-center'>
			<div>
				{props.body && <ComponentRender {...props.body} />}
			</div>
		</div>
	)
}

/**
 * TODO
 *
 * **Example**
 *
 * ```rust CenterLayout::new("Normal Center Layout").subtitle("Some Subtitle").body(Button::new("Hello there!").full()) ```
 *
 * ```rust CenterLayout::new("Thin Center Layout").subtitle("Some Subtitle").thin().body(Button::new("Hello there!").full()) ```
 *
 * @component
 */
export interface CenterLayout {
	title: string

	body?: Component
	subtitle?: string
	thin?: boolean
}

export function CenterLayoutRender(props: CenterLayout) {
	return (
		<div class='flex items-center flex-col w-full h-full p-30' style={{ justifyContent: 'safe center' }}>
			<div class={`flex flex-col gap-20 ${props.thin ? 'max-w-sm' : 'max-w-xl'} w-full`}>
				<h1 class='text-3xl'>
					<LabelRender color={{ type: 'Fore', def: 80 }} bold italic={false} text={props.title} />
				</h1>
				{props.subtitle && <h3 class='text-fore-50'>{props.subtitle}</h3>}
				{props.body && (
					<div>
						<ComponentRender {...props.body} />
					</div>
				)}
			</div>
		</div>
	)
}
