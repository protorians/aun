import type {
  IAppearance,
  IAppearanceObject,
  IAppearanceStyleSheet,
  IEventDispatcher,
  IEventDispatcherCallback,
  INavigation,
  INavigationMiddlewareCallback,
  INavigationOptions,
  IProps
} from "@protorians/core/types";
import { ICoreTransition } from "@protorians/core/types";



export type IElementTargetAttribute = '_blank' | '_self' | '_parent' | '_top' | string;


export type IThemeColor =

  'text'

  | 'text-lite'
  | 'text-heavy'

  | 'layer-heavy'
  | 'layer'
  | 'layer-lite'

  | 'one-lite'
  | 'one'
  | 'one-heavy'

  | 'two-lite'
  | 'two'
  | 'two-heavy'

  | 'three-lite'
  | 'three'
  | 'three-heavy'

  | 'four-lite'
  | 'four'
  | 'four-heavy'

  | 'five-lite'
  | 'five'
  | 'five-heavy'

  | 'error-lite'
  | 'error'
  | 'error-heavy'

  | 'warning-lite'
  | 'warning'
  | 'warning-heavy'

  | 'success-lite'
  | 'success'
  | 'success-heavy'

  | 'black-lite'
  | 'black'
  | 'black-heavy'

  | 'white-lite'
  | 'white'
  | 'white-heavy'

  | 'dark-lite'
  | 'dark'
  | 'dark-heavy'

  | 'light-lite'
  | 'light'
  | 'light-heavy'

  ;

export type IMouseActionPayload<I> = { event?: Event, item: I }

export type IMouseAction<I> = {

  type?: keyof HTMLElementEventMap;

  callback: (payload: IMouseActionPayload<I>) => void;

}

export interface AunNode {

  AUNAOD?: boolean;

}

export type AUNWindow = Partial<Window> & {

  /**
   * Stockage des composant crée
   */
  AUNRC?: IRegistryComponentConstructorStack

  /**
   * Stockage des Observateurs de mutation pour l'hydratation des composants
   */
  AUNHW?: MutationObserver;

  CurrentStackViews?: IStackViews<any> | undefined;

}


export type IChild = string
  | number
  | boolean
  | null
  | IStateManager<IState>
  | IWidget<any, any>
  | HTMLElement
  | undefined;

export type IChildren = IChild
  | Promise<IWidget<any, any>>
  | Array<IChild | Promise<IWidget<any, any>>>
  | Array<IChildren>;


export type IChildElement = IStateManager<IState>
  | IWidget<any, any>
  | HTMLElement
  | undefined;

export type IChildrenElement = IChildElement
  | Promise<IWidget<any, any>>
  | Array<IChildElement | Promise<IWidget<any, any>>>
  | Array<IChildElement>
  | undefined;


export type INode = HTMLElement;

export type INodeLayer = HTMLDivElement;

export type INodeText = HTMLSpanElement;


export type IWTarget = string | INode | NodeListOf<INode> | IElement<INode>;

export type IWTargetNode = INode | NodeListOf<INode> | IElement<INode>;


export type IFindElementCallback = (element: HTMLElement) => void


export interface IRegistryComponentConstructorStack {

  [K: string]: (props: any) => IWidget<any, any>

}

export type IObjectToString = {

  eq?: string | undefined;

  start?: string | undefined;

  end?: string | undefined;

  joiner?: string | undefined;

}



export interface IWidgetAttributeProps {

  attributes: IAttributesMap,

  ns?: string | undefined,

  separator?: string | undefined

}

export interface IWidgetAttributeNSProps {

  attributes: IAttributesMap,

  ns?: string | undefined

}



export type IWidgetReferrerPolicy = 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | ' origin-when-cross-origin' | 'unsafe-url';



export interface IWidgetHTMLGlobalProps {

  accesskey?: string;

  contenteditable?: string;

  dir?: string;

  id?: string;

  lang?: string;

  title?: string;

  tabindex?: number;

  spellcheck?: boolean;

  draggable?: boolean;

  hidden?: boolean;

  translate?: 'yes' | 'no';

  rel?: string;

}



export interface IWidgetGlobalStandardProps extends IWidgetStandardProps, IWidgetHTMLGlobalProps {

}



/**
 * IWidgetStandardProps extends IProps
 * @description Propriétés de widget de base
 */
export interface IWidgetStandardProps extends IProps {

  child?: IChildren | IChildrenElement;

  measure?: IElementMeasureCallback;

  offset?: IElementOffsetCallback;

  html?: string | undefined;

  append?: string | Node | (string | Node)[];

  style?: IElementCSS | undefined;

  removeStyle?: IElementCSSRemoves;

  toggleClassname?: IElementClassName;

  classname?: IElementClassName;

  removeClassname?: IElementClassName;

  inlineClassname?: string;

  attribute?: IWidgetAttributeProps | IWidgetAttributeProps[];

  attributeNS?: IWidgetAttributeNSProps | IWidgetAttributeNSProps[];

  removeAttribute?: IWidgetAttributeProps | IWidgetAttributeProps[];

  toggleAttribute?: IWidgetAttributeProps | IWidgetAttributeProps[];

  data?: IProps;

}


export interface IWidgetProps extends IWidgetStandardProps, IWidgetHTMLGlobalProps {

  child?: IChildrenElement;

}




/**
 * ITextProps extends IWidgetStandardProps
 * @description Propriétés des textes de widget
 */
export interface ITextProps extends IWidgetStandardProps, IWidgetHTMLGlobalProps {

  child: string | IWidget<ITextProps, HTMLSpanElement>;

}




export interface IVideoProps extends IWidgetStandardProps, IWidgetHTMLGlobalProps {

  autoplay?: boolean;

  controls?: boolean;

  loop?: boolean;

  muted?: boolean;

  width?: string;

  height?: string;

  poster?: string;

  preload?: 'auto' | 'metadata' | 'none';

  src?: string;

}



export interface IAudioProps extends IWidgetStandardProps, IWidgetHTMLGlobalProps {

  autoplay?: boolean;

  controls?: boolean;

  loop?: boolean;

  muted?: boolean;

  preload?: boolean;

  src: string;

}



export interface IIFrameProps extends IWidgetStandardProps, IWidgetHTMLGlobalProps {

  allow?: string;

  allowfullscreen?: 'true' | 'false';

  allowpaymentrequest?: 'true' | 'false';

  loading?: 'eager' | 'lazy';

  name?: string;

  referrerpolicy?: IWidgetReferrerPolicy;

  sandbox?: 'allow-forms' | 'allow-pointer-lock' | 'allow-popups' | 'allow-same-origin' | 'allow-scripts' | 'allow-top-navigation';

  src: string;

}



export interface IModalProps extends IProps {

  trigger: IWidget<any, any>;

  child: IChildElement;

  isOpen?: boolean;

  color?: string;

  opacity?: number;

  locked?: boolean;

  transition?: ICoreTransition;

  blurred?: boolean;

}

export interface IModalStateProps extends IProps {

  open: boolean;

}




export interface IFormProps extends IWidgetStandardProps, IWidgetHTMLGlobalProps {

  acceptCharset?: string;

  action?: string;

  autocomplete?: 'on' | 'off';

  enctype?: string;

  method?: 'get' | 'post';

  name?: string;

  novalidate?: boolean;

  rel?: 'external'

  | 'license'

  | 'next'

  | 'nofollow'

  | 'noopener'

  | 'noreferrer'

  | 'opener'

  | 'prev'

  | 'search'

  | 'help';

  target?: IElementTargetAttribute;

  child: IChildElement

}



export interface IAnchorProps extends IWidgetStandardProps, IWidgetHTMLGlobalProps {

  href: string;

  hreflang?: string;

  ping?: string;

  referrerpolicy?: IWidgetReferrerPolicy;

  target?: IElementTargetAttribute;

  type?: string;

  download?: string;

  media?: string;

}



export interface IButtonProps extends IWidgetStandardProps, IWidgetHTMLGlobalProps {

  type?: 'button' | 'submit' | 'reset';

  child: IChildren

}


export interface IInputProps extends IWidgetStandardProps, IWidgetHTMLGlobalProps {

  type?: 'text'

  | 'button'

  | 'color'

  | 'date'

  | 'datetime-local'

  | 'email'

  | 'file'

  | 'hidden'

  | 'image'

  | 'month'

  | 'number'

  | 'password'

  | 'radio'

  | 'range'

  | 'reset'

  | 'search'

  | 'submit'

  | 'tel'

  | 'time'

  | 'url'

  | 'week'

  | 'checkbox';

  accept?: string;

  alt?: string;

  autocomplete?: 'on' | 'off';

  autofocus?: boolean;

  checked?: boolean;

  dirname?: string;

  disabled?: boolean;

  form?: string;

  formaction?: string;

  formenctype?: string;

  formmethod?: 'get' | 'post';

  formnovalidate?: boolean;

  formtarget?: IElementTargetAttribute;

  list?: string;

  max?: number | string;

  min?: number | string;

  maxlength?: number;

  minlength?: number;

  multiple?: boolean;

  pattern?: RegExp;

  placeholder?: string;

  readonly?: boolean;

  required?: boolean;

  size?: number;

  src?: string;

  step?: number;

  value?: string;

}


export interface IImageProps extends IWidgetStandardProps, IWidgetHTMLGlobalProps {

  src: string;

  mode?: 'cover' | 'contain' | 'auto';

  alt?: string;

  aspectRatio?: string;

  crossorigin?: string;

  ismap?: boolean;

  loading?: 'eager' | 'lazy';

  longdesc?: string;

  referrerpolicy?: IWidgetReferrerPolicy;

  sizes?: string;

  srcset?: string;

  usemap?: string;

  child?: undefined;

}


export interface IPhysicalMethods {

  asyncMeasure(): DOMRect;

  measure(callback: IElementMeasureCallback): this;

  clean(): this;

  remove(): this;

  asyncOffset(): IElementOffset;

  offset(callback: IElementOffsetCallback): this;

  content(child?: IChildren | undefined): this | IChildren;

  html(data?: string | undefined): this | string;

  append(...nodes: (string | Node)[]): this;

  data(key: string, value: string): this;

  listen<L extends keyof IElementEmitterScheme>(

    type: L,

    callback: IEventDispatcherCallback<IElementEmitterScheme[L]>

  ): this;

  on<T extends keyof HTMLElementEventMap>(

    type: T,

    callback: IElementEventCallback<T>,

    options?: AddEventListenerOptions | boolean | undefined

  ): this;


  style(tokens: IElementCSS | undefined): this;

  removeStyle(tokens: IElementCSSRemoves): this;


  toggleClassname(tokens: IElementClassName): this;

  addInlineClassname(tokens: string): this;

  classname(tokens: IElementClassName | undefined): this;

  getClassname(): string[];

  removeClassname(tokens: IElementClassName): this;

  // replaceClassName( older : IElementClassName, newer : IElementClassName ) : this;


  attribute(
    tokens?: IAttributesMap | undefined,
    ns?: string | undefined,
    separator?: string | undefined
  ): this;

  attributeNS(
    tokens?: IAttributesMap | undefined,
    ns?: string | undefined
  ): this;

  removeAttribute(
    tokens: IAttributesMap,
    ns?: string | undefined,
    separator?: string | undefined
  ): this;

  toggleAttribute(
    tokens: IAttributesMap,
    ns?: string | undefined,
    separator?: string | undefined
  ): this;

}




export type IElementCSS = Partial<CSSStyleDeclaration>;

export type IElementCSSRemoves = keyof IElementCSS | Array<keyof IElementCSS>;

export type IElementListenerCallback = () => void

export type IElementEventCallback<T extends keyof HTMLElementEventMap> = (args: HTMLElementEventMap[T]) => void

export type IElementClassName = string[] | string;

// export interface IElementClassName{

//   [ C : string ] : string | IElementClassName | undefined;

// }

// export interface IAttribute{

//   [ A : string ] : string | IAttribute | undefined

// }


// export interface IAttributesProps extends IAttributesMap{

//   [ A : string ] : IAttributesProps | string  | number | boolean | null

// }



export interface IElementEmitterScheme {

  own: IWidget<any, any>;

  measure: DOMRect;

  clean: undefined;

  remove: undefined;

  offset: IElementOffset;

  content: IChildren | IChildren[];

  html: string;

  on: {

    type: keyof HTMLElementEventMap;

    callback: IElementEventCallback<any>;

    options: AddEventListenerOptions | boolean | undefined

  }

  style: IElementCSS;

  removeStyle: IElementCSSRemoves;

  toggle: IElementClassName

  append: Array<string | Node>

  className: IElementClassName;

  removeClassName: IElementClassName;

  // replaceClassName : {

  //   older : IElementClassName;

  //   newer : IElementClassName;

  // };

}

export type IElementMeasureCallback = (offset: DOMRect) => void

export type IElementOffsetCallback = (offset: IElementOffset) => void

export type IElementOffset = {

  height: number

  width: number

  top: number

  left: number

  parent: Element | null

}

export interface IElement<E extends INode> extends IPhysicalMethods {

  instance: E;

  emitter: IEventDispatcher<IElementEmitterScheme>;

  get widget(): IWidget<any, E> | undefined;

  own<P extends IWidgetStandardProps>(widget: IWidget<P, E> | undefined): this;

  // append( ...nodes: (string | Node)[] ) : this;

}





export type IWidgetTimerCallback = <

  P extends IWidgetStandardProps,

  E extends INode

>(widget: IWidget<P, E>, timer: NodeJS.Timeout) => void

export type IWidgetRequestAnimationFrameCallback = <

  P extends IWidgetStandardProps,

  E extends INode

>(widget: IWidget<P, E>) => void


export type IWidgetAsyncCallback = (

  resolve: (value: IWidget<any, any> | PromiseLike<IWidget<any, any>>) => void,

  reject: (reason?: any) => void

) => void


export type IWidgetLayerCallback<E extends INode> = (element: IElement<E>) => void

export type IWidgetReadyCallback<P extends IWidgetStandardProps, E extends INode> = (widget: IWidget<P, E>) => void


export interface IWidgetEmitterScheme<P extends IWidgetStandardProps, E extends INode> {

  ready: IWidget<P, E>;

  beforeRendering: IChildren;

  afterRendering: IChildren;

  property: P[keyof P];

  excavation: IWidget<P, E>;

  remove: undefined;

  childAdded: IChildren;

  elementAdded: Element;

  widgetAdded: IWidget<any, any>;

  promiseAdded: Promise<IWidget<any, any>>;

  htmlAdded: string | boolean | number;

  stateAdded: IStateManager<any>;

}

export interface IWidget<P extends IWidgetStandardProps, E extends INode> {

  element: IElement<E>;

  child?: IChildren | IChildren[] | undefined;

  get props(): P;

  emitter: IEventDispatcher<IWidgetEmitterScheme<P, E>>;

  construct: IConstruct<P, E>;

  ready(callback: IWidgetReadyCallback<P, E>): this;

  manipulate(callback: IWidgetLayerCallback<E>): this;

  appear(payload: IAppearanceObject): this;

  content(child?: IChildren | undefined): this | IChildren;

  // append( ...child : IChildren[] ) : this;

  refresh(props?: Partial<P> | undefined): this;

  render(): this;

  remove(): this;


  timeOut(callback: IWidgetTimerCallback, time?: number): this;

  timeInterval(callback: IWidgetTimerCallback, time?: number): this;

  frameReady(callback: IWidgetRequestAnimationFrameCallback): this;

  // catch<P extends IWidgetStandardProps, E extends INode>( callback : IStateErrorExceptionCallback<P, E> ) : IWidget<P, E>;

}



/**
 * IState
 * @description
 */
export interface IStateObject {

  [K: string]: IState

}

export type IState = IStateObject | boolean | string | number | null | undefined


export type IStateRecords<S extends IState> = {

  anchor: Text | undefined;

  widget: IWidget<any, any> | undefined;

  callback: IStateCallback<S>;

}


export type IStateCallback<S extends IState> = (state: S) => IWidget<any, any> | undefined;

export type IStateVoidCallback<S extends IState> = (state: S) => void;


export type IStateErrorCallbackAunyload<M> = {

  manager: M;

  error: any;

}

export type IStateErrorCallback<S extends IState> = (

  payload: IStateErrorCallbackAunyload<IStateManager<S>>

) => void;



export interface IStateManagerEmitterScheme<S extends IState> {

  success: IStateManager<S>;

  error: unknown;

  init: S

  change: S

}


export interface IStateManager<S extends IState> {

  emitter: IEventDispatcher<IStateManagerEmitterScheme<S>>

  get value(): S;

  records(widget: IWidget<any, any>): this;

  record(widget: IWidget<any, any>, record: IStateRecords<any>): IStateRecords<any>;

  sync(): this;

  set(value: S | Partial<S>): this;

  use(

    callback: IStateCallback<S>

  ): this;

}



export interface IWidgerErrorException {

  messageToString(data: string): string;

}






export interface IConstructEmitterScheme<P extends IWidgetStandardProps, E extends INode> {

  before: IWidget<P, E>;

  after: IWidget<P, E>;

  appearance: IAppearance;

}

export interface IConstruct<P extends IWidgetStandardProps, E extends INode> {

  emitter: IEventDispatcher<IConstructEmitterScheme<P, E>>;

  appearance: IAppearance;

  make(root: IWidget<P, E>, child: IChildren | IChildren[]): IWidget<P, E>;

  makeRoot(root: IWidget<P, E>): IWidget<P, E>;

  makeChildren(root: IWidget<P, E>, child: IChildren): IWidget<P, E>;

  makeAppearance(root: IWidget<P, E>, payload: IAppearanceObject): IWidget<P, E>;

  propertyBuilder(root: IWidget<P, E>, slug: keyof IWidgetStandardProps, value: any): this;
}









export type IHydrateComponent<

  P extends IWidgetStandardProps,

  E extends HTMLElement

> = ((props: P) => IWidget<P, E>)

export type IComponentConstructor = ((props: any) => IWidget<any, any>)





export type IAttributesMapValues = IAttributesMap | Array<any> | string | number | boolean | null | (() => void)

export type IAttributesMap = {

  [A: string]: IAttributesMapValues

}

export type IAttributesAunrsed = {

  [A: string]: string;

}

export type IAttributesToggleMap = {

  [A: string]: boolean;

}

export type IAttributeSyncAunyload = {

  entries: string[];

}

export type IAttributeAddAunyload = {

  added: string;

}

export type IAttributeRemoveAunyload = {

  removed: string;

}

export type IAttributeReplaceAunyload = {

  older: string;

  newer: string;

}

export type IAttributeUnlinkAunyload = {

  value: string[] | string;

}

export type IAttributesEmitterScheme = {

  sync: IAttributeSyncAunyload;

  add: IAttributeAddAunyload;

  remove: IAttributeRemoveAunyload;

  replace: IAttributeReplaceAunyload;

  link: IAttribute;

  unlink: IAttributeUnlinkAunyload;

  unlinks: IAttribute;

}

export interface IAttribute {

  attributeName: string;

  get entries(): string[];

  get value(): string;

  sync(attribute?: string): this;

  add(value: string): this;

  remove(value: string): this;

  replace(older: string, value: string): this;

  contains(value: string): boolean;

  link(): this;

  unlink(property?: string | string[]): this;

}




// export interface IKitEmitterScheme{

// }

export interface IKitProps {

  appearance: IAppearanceStyleSheet | string | string[];

  component: IComponentConstructor;

}

// export interface IKit<P extends IWidgetStandardProps, E extends INode>{

//   emitter : IEventDispatcher<IKitEmitterScheme>;

//   props : IKitProps<P, E> | undefined

//   render(): this;

// }





export type IViewEmitterCallbackArgument<P extends IWidgetStandardProps> = {

  component: IWidget<P, HTMLDivElement>;

  router: IView<P>

}

export type IViewEmitterCallback<P extends IWidgetStandardProps> = (

  payload: IViewEmitterCallbackArgument<P>

) => void


export interface IViewEmitters<P extends IWidgetStandardProps> {

  show?: IViewEmitterCallback<P>;

  hide?: IViewEmitterCallback<P>;

}


export interface IViewOptions<P extends IWidgetStandardProps> {

  name: string;

  title: string;

  presenter?: 'normal' | 'modal' | 'overlay' | 'overlaySideLeft' | 'overlaySideRight';

  emitters?: IViewEmitters<P>;

  transitions?: {

    entry: ICoreTransition;

    exit: ICoreTransition;

  };

  // switcher ?: IViewSwitcher;

}

export interface IViewProps extends IProps {

  [k: string]: any;

  stack: IStackViews<any>;

  child?: IChildren;


}

export type IViewWidget<P extends IWidgetStandardProps> = ((props: P)

  => IWidget<any, any>)

  ;

export interface IView<P extends IWidgetStandardProps> {

  get parameters(): P;

  get component(): IWidget<P, HTMLDivElement> | undefined

  options: IViewOptions<P>;

  componentConstructor: IViewWidget<P>;

  // componentConstructor : IComponentConstructor;

  show(parameters: P): this;

  hide(): this;

  refresh(parameters?: Partial<P> | undefined): this;

  render(): IWidget<P, HTMLDivElement>;

}




export type IStackViewsOptions<Scheme> = Omit<Partial<INavigationOptions<Scheme>>, 'middlewares'> & {

  index?: keyof Scheme;

  canvas?: IWTarget

  errorView?: keyof Scheme;

  middlewares?: INavigationMiddlewareCallback<Scheme>[];

}

export type IStackViewsList<Scheme> = {

  [K in keyof Scheme]: IView<any>

}

export interface IStackViewsEmitterScheme<Scheme> {

  error: keyof Scheme;

}

export interface IStackViews<Scheme> {

  get views(): IStackViewsList<Scheme>;

  emitter: IEventDispatcher<IStackViewsEmitterScheme<Scheme>>

  options: IStackViewsOptions<Scheme>;

  navigation: INavigation<Scheme>;

  get current(): IWidget<any, any> | undefined;

  last: IWidget<any, any> | undefined;

  middleware(callback: INavigationMiddlewareCallback<Scheme>): this;

  run(): this;

}









