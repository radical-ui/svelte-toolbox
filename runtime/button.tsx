import { useDispatcher } from './event.tsx'
import { doBubble } from './bubble.ts'
import { EventKey, React } from './deps.ts'
import { IconRender } from './icon.tsx'
import { Spinner } from './spinner.tsx'
import { getColor } from './utils.ts'
import { Color } from './theme.tsx'

export type ButtonSize = 'Small' | 'Medium' | 'Large'

/**
 * A button that has a label and an event.
 *
 * **Example**
 *
 * ```rust #[derive(HasActionKey, Serialize, Deserialize)] enum Event { Foo, Bar, }
 *
 * Flex::new(FlexKind::Column) .gap(10) .align(FlexAlign::Center) .justify(FlexJustify::Center) .auto_item( Flex::new(FlexKind::Row) .gap(10) .align(FlexAlign::Center) .auto_item( Button::new("Small Button") .event(Event::Foo) .size(ButtonSize::Small) ) .auto_item( Button::new("Medium Button") .event(Event::Foo) ) .auto_item( Button::new("Large Button") .event(Event::Bar) .size(ButtonSize::Large) ) ) .auto_item( Flex::new(FlexKind::Row) .gap(10) .auto_item( Button::new("Fore Button") .event(Event::Foo) .color(Color::Fore(5)) ) .auto_item( Button::new("Success Button") .event(Event::Foo) .color(Color::Success(100)) ) .auto_item( Button::new("Danger Button") .event(Event::Foo) .color(Color::Danger(100)) ) ) .auto_item( Flex::new(FlexKind::Row) .gap(10) .auto_item( Button::new("Leading Icon") .event(Event::Foo) .leading_icon("mdi-ab-testing") ) .auto_item( Button::new("Trailing Icon") .event(Event::Foo) .trailing_icon("mdi-ab-testing") ) .auto_item( Button::new("Both") .event(Event::Bar) .trailing_icon("mdi-ab-testing") .leading_icon("mdi-ab-testing") .outline() ) ) ```
 *
 * @component
 */
export interface Button {
	event?: EventKey<null>
	color?: Color
	full?: boolean
	label: string
	leadingIcon?: string
	outline?: boolean
	size?: ButtonSize
	trailingIcon?: string
}

export function ButtonRender(props: Button) {
	const color = props.color || { type: 'Primary', def: 100 }
	const size = props.size || 'Medium'

	const { isLoading, dispatch, isDisabled: isActionDisabled } = useDispatcher(props.event ?? null)

	const scale = size === 'Large' ? 1 : size === 'Small' ? 0.6 : 0.8
	const isDisabled = isActionDisabled || isLoading

	const innerColor: Color = props.outline
		? color
		: color.type === 'Base' || color.type === 'Fore'
		? { type: 'Fore', def: 100 }
		: { type: 'DecorationFore', def: 100 }

	const textColor = `text-${getColor(innerColor, 100)}`

	const backgroundStyles = props.outline
		? `bg-transparent ${!isDisabled ? 'hover:bg-fore-10' : ''}`
		: `bg-${getColor(color)} ${!isDisabled ? `hover:bg-${getColor(color, -10)}` : ''} transition-colors`
	const borderStyles = props.outline ? `border border-${getColor(color)}` : ''

	return (
		<button
			class={`
				px-${Math.round(scale * 14)} py-${Math.round(scale * 8)} rounded
				${backgroundStyles} ${borderStyles} transition-colors
				uppercase font-semibold relative overflow-hidden
				focus:ring-4 ring-${getColor(color, 40)}
				${textColor}
				${props.full ? 'w-full' : ''}
				${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
			`}
			type='button'
			disabled={isDisabled}
			onClick={(event) => {
				if (!props.event) return console.error('button was clicked while disabled')

				doBubble(event.currentTarget, event)
				dispatch(null)
			}}
		>
			<div
				class={`
					flex gap-${Math.round(scale * 8)} items-center ${isLoading ? `def-0` : ''}
					${props.full ? 'w-full justify-center' : ''}`}
			>
				{props.leadingIcon && <IconRender name={props.leadingIcon} size={Math.round(scale * 18)} color={innerColor} />}
				<div class={`${size === 'Large' ? 'text-lg' : ''} ${size === 'Small' ? 'text-sm' : ''}`}>{props.label}</div>
				{props.trailingIcon && <IconRender name={props.trailingIcon} size={Math.round(scale * 18)} color={innerColor} />}
			</div>

			{isLoading
				? (
					<div class='inset-0 absolute flex justify-center items-center '>
						<Spinner color={innerColor} size={size === 'Large' ? 30 : size === 'Medium' ? 25 : 20} />
					</div>
				)
				: <></>}
		</button>
	)
}
