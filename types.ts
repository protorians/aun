export interface AunNode{

  AUNAOD?: boolean;
  
}

export type AUNWindow = Partial<Window> & {

  /**
   * Stockage des composant crée
   */
  AUNRC ?: IRegistryComponentConstructorStack

  /**
   * Stockage des Observateurs de mutation pour l'hydratation des composants
   */
  AUNHW ?: MutationObserver

}

export type IChild = string 
  | number 
  | boolean 
  | IStateManager<IState> 
  | IWidget<any, any> 
  | HTMLElement 
  | undefined;

export type IChildren = IChild 
  | Promise<IWidget<any, any>> 
  | Array<IChild 
  | Promise<IWidget<any, any>>> 
  | IChildren[];

export type INode = HTMLElement;

export type INodeLayer = HTMLDivElement;

export type INodeText = HTMLSpanElement;


export type IWTarget = string | INode | NodeListOf<INode> | IElement<INode>;

export type IWTargetNode = INode | NodeListOf<INode> | IElement<INode>;


export type IFindElementCallback = ( element : HTMLElement ) => void


export interface IRegistryComponentConstructorStack {

  [ K: string ] : ( props: any ) => IWidget<any, any> 

}

export type IObjectToString = {

  eq ?: string | undefined;

  start ?: string | undefined;

  end ?: string | undefined;

  joiner ?: string | undefined;
  
}

/**
 * IProps
 * @description définition des propriétés de base
 */
export interface IProps {

  [ P : string ] : any;

}


/**
 * IWProps extends IProps
 * @description Les propriétés d'un widget. Les propriétés iront en attributs html avec le prefix "prop:{KEY}" pour garder la persistence. Les données de type objet seront convetir en JSON
 */
export interface IWProps extends IProps{

  children ?: IChildren;

}



export type IEmitterCallback<I> = ( payload : I ) => void | boolean;


export type IEmitterEntry = {

  force ?: boolean;

  callback : IEmitterCallback<any>
  
}

export type IEmitterEntries<Scheme extends IEmitterScheme> = {

  [ K in keyof Scheme ] : IEmitterEntry[]
  
}


export type IEmitterProgations<Scheme extends IEmitterScheme> = {

  [ K in keyof Scheme ] : boolean
  
}


export interface IEmitterScheme{

  [ K : string ] : any
  
}



export interface IPhysicalMethods{

  asyncMeasure() : DOMRect;

  measure( callback : IElementMeasureCallback ) : this;

  clean() : this;

  remove() : this;

  asyncOffset() : IElementOffset;

  offset( callback : IElementOffsetCallback ) : this;

  content( children ?: IChildren | undefined ) : this | IChildren;

  html( data ?: string | undefined ) : this | string;

  append( ...nodes: (string | Node)[] ) : this;


  listen<L extends keyof IElementEmitterScheme>( 
    
    type : L, 
    
    callback : IEmitterCallback<IElementEmitterScheme[L]>
    
  ) : this;

  on<T extends keyof HTMLElementEventMap>( 
    
    type : T, 
    
    callback : IElementEventCallback<T>,

    options?: AddEventListenerOptions | boolean | undefined
    
  ) : this;


  style( tokens : IElementCSS | undefined ) : this;

  removeStyle( tokens : IElementCSSRemoves ) : this;

  
  toggle( tokens : IElementClassName ) : this;

  className( tokens : IElementClassName | undefined ) : this | string[];

  removeClassName( tokens : IElementClassName ) : this;

  // replaceClassName( older : IElementClassName, newer : IElementClassName ) : this;


  attribute( 
    tokens ?: IAttributesMap | undefined, 
    ns?: string | undefined, 
    separator?: string | undefined 
  ) : this;

  attributeNS( 
    tokens ?: IAttributesMap | undefined, 
    ns?: string | undefined
  ) : this;

  removeAttribute( 
    tokens : IAttributesMap,
    ns?: string | undefined, 
    separator?: string | undefined 
  ) : this;

  toggleAttribute( 
    tokens : IAttributesMap,
    ns?: string | undefined, 
    separator?: string | undefined 
  ) : this;
  
}


export interface IEmitter<Scheme extends IEmitterScheme>{

  propagations : IEmitterProgations<Scheme>;

  entries : IEmitterEntries<Scheme>;

  listen<I extends keyof Scheme>( type : I, callback : IEmitterCallback<Scheme[ I ]>, force ?: boolean ) : this;

  dispatch( type : keyof Scheme, data ?: any ) : this;
  
}



export type IElementCSS = Partial<CSSStyleDeclaration>;

export type IElementCSSRemoves = keyof IElementCSS | Array<keyof IElementCSS>; 

export type IElementListenerCallback = () => void

export type IElementEventCallback<T extends keyof HTMLElementEventMap> = ( args : HTMLElementEventMap[T] ) => void

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

  own : IWidget<any, any>;

  measure : DOMRect;

  clean : undefined;

  remove : undefined;

  offset : IElementOffset;

  content : IChildren | IChildren[];

  html : string;

  on : {

    type: keyof HTMLElementEventMap;
    
    callback: IElementEventCallback<any>;
    
    options : AddEventListenerOptions | boolean | undefined
    
  }

  style : IElementCSS;

  removeStyle : IElementCSSRemoves;

  toggle : IElementClassName

  append : Array<string | Node>

  className : IElementClassName;

  removeClassName : IElementClassName;

  // replaceClassName : {

  //   older : IElementClassName;

  //   newer : IElementClassName;
    
  // };
  
}

export type IElementMeasureCallback = ( offset : DOMRect ) => void

export type IElementOffsetCallback = ( offset : IElementOffset ) => void

export type IElementOffset = {

  height : number

  width : number

  top : number

  left : number

  parent : Element | null
  
}

export interface IElement<E extends INode> extends IPhysicalMethods {

  instance : E;

  emitter : IEmitter<IElementEmitterScheme>;

  get widget() : IWidget<any, E> | undefined;

  own<P extends IWProps>( widget : IWidget<P, E> | undefined ) : this;

  // append( ...nodes: (string | Node)[] ) : this;
  
}





export type IWidgetTimerCallback = <

  P extends IWProps, 

  E extends INode

  >( widget : IWidget<P, E>, timer : NodeJS.Timeout ) => void

export type IWidgetRequestAnimationFrameCallback = <

  P extends IWProps, 

  E extends INode

  >( widget : IWidget<P, E> ) => void


export type IWidgetAsyncCallback = ( 

  resolve: (value: IWidget<any, any> | PromiseLike<IWidget<any, any>>) => void, 
  
  reject: (reason?: any) => void 

) => void


export type IWidgetLayerCallback<E extends INode> = ( element : IElement<E> ) => void

export type IWidgetReadyCallback<P extends IWProps,E extends INode> = ( widget : IWidget<P, E> ) => void


export interface IWidgetEmitterScheme<P extends IWProps, E extends INode> {

  ready : IWidget<P, E>;

  beforeRendering : IChildren;

  afterRendering : IChildren;
  
  property : P[ keyof P ];

  excavation : IWidget<P, E>;

  remove : undefined;

  childAdded : IChildren;

  elementAdded : Element;

  widgetAdded : IWidget<any, any>;

  promiseAdded : Promise<IWidget<any, any>>;

  htmlAdded : string | boolean | number;

  stateAdded : IStateManager<any>;

}

export interface IWidget<P extends IWProps, E extends INode>{

  element : IElement<E>;

  children ?: IChildren | IChildren[] | undefined;

  get props() : P;
  
  emitter : IEmitter<IWidgetEmitterScheme<P, E>>;
  
  construct : IConstruct<P, E>;

  ready( callback : IWidgetReadyCallback<P, E> ) : this;

  layer( callback : IWidgetLayerCallback<E> ) : this;

  appear( payload : IAppearanceObject ) : this;

  content( children ?: IChildren | undefined ) : this | IChildren;

  // append( ...children : IChildren[] ) : this;

  refresh( props ?: Partial<P> | undefined ) : this;
  
  render() : this;

  remove() : this;


  timeOut( callback : IWidgetTimerCallback, time ?: number ) : this;

  timeInterval( callback : IWidgetTimerCallback, time ?: number ) : this;

  frameReady( callback : IWidgetRequestAnimationFrameCallback ) : this;
  
  // catch<P extends IWProps, E extends INode>( callback : IStateErrorExceptionCallback<P, E> ) : IWidget<P, E>;
  
}



/**
 * IState
 * @description
 */
export interface IStateObject{
  
  [ K: string ] : IState

}

export type IState = IStateObject | boolean | string | number | null | undefined


export type IStateRecords<S extends IState> = {

  anchor: Text | undefined;

  widget: IWidget<any, any> | undefined;

  callback: IStateCallback<S>;
  
}


export type IStateCallback<S extends IState> = ( state : S ) => IWidget<any, any>;


export type IStateErrorCallbackAunyload<M> = {

  manager : M;

  error: any;
  
}

export type IStateErrorCallback<S extends IState> = ( 
  
  payload : IStateErrorCallbackAunyload<IStateManager<S>> 
  
) => void;



export interface IStateManagerEmitterScheme<S extends IState> {

  success : IStateManager<S>;

  error : unknown;

  init : S

  change: S
  
}


export interface IStateManager<S extends IState>{

  emitter : IEmitter<IStateManagerEmitterScheme<S>>

  get value() : S;
  
  records( widget : IWidget<any, any> ) : this;

  record( widget : IWidget<any, any>, record : IStateRecords<any> ) : IStateRecords<any>;

  sync() : this;

  set( value : S | Partial<S> ) : this;
  
  use( 
    
    callback : IStateCallback<S> 
    
  ) : this;
  
}



export interface IWidgerErrorException{

  messageToString( data : string ) : string;

}






export interface IConstructEmitterScheme<P extends IWProps, E extends INode> {

  before : IWidget<P, E>;

  after : IWidget<P, E>;
  
  appearance: IAppearance;

}

export interface IConstruct<P extends IWProps, E extends INode>{

  emitter : IEmitter<IConstructEmitterScheme<P, E>>;

  appearance : IAppearance;

  make( root : IWidget<P, E>, children : IChildren | IChildren[] ) : IWidget<P, E>;

  makeChildren( root : IWidget<P, E>, children : IChildren ): IWidget<P, E>;

  makeAppearance( root : IWidget<P, E>, payload : IAppearanceObject ): IWidget<P, E>;
  
}






export interface IAppearanceEmitterScheme {

  ready: IAppearance;

  insertProperties: IAppearanceObject;

  removeProperties: IAppearanceObjectDestroyed;
  
  set: IAppearanceObject;

  unset: IAppearanceObjectDestroyed;
  
  mount: IAppearance;

  sync: IAppearance;

  destroy: undefined;
  
}

export type IAppearanceValues = string | number | undefined

export interface IAppearanceCSSDeclaration extends Partial<CSSStyleDeclaration>{

  paddingVertical ?: IAppearanceValues;
  
  paddingHorizontal ?: IAppearanceValues;
  
  marginVertical ?: IAppearanceValues;
  
  marginHorizontal ?: IAppearanceValues;
  
}

export type IAppearanceObject = {

  [ K in keyof Partial<IAppearanceCSSDeclaration> ] : IAppearanceValues;

}

export interface IAppearanceStyleSheet{

  [ Selector : string ] : IAppearanceObject;

}

export type IAppearanceObjectDestroyed =  Array<keyof IAppearanceObject>

export interface IAppearance{

  instance: HTMLStyleElement;

  uid : string;

  properties: IAppearanceObject; 

  emitter: IEmitter<IAppearanceEmitterScheme>;

  insertProperties( 
    
    properties : IAppearanceObject, 
    
    data : IAppearanceObject 
    
  ) : IAppearanceObject;

  removeProperties( 
    
    properties : IAppearanceObject, 
    
    payload : IAppearanceObjectDestroyed 
    
  ) : IAppearanceObject

  sheet( stylesheet : IAppearanceStyleSheet ) : this;

  set( payload : IAppearanceObject ) : this;

  unset( payload : IAppearanceObjectDestroyed ) : this;

  mount() : this;

  mountImmediat() : this;

  sync() : this;

  destroy() : this;
  
}




export type IHydrateComponent<
  
  P extends IWProps, 
  
  E extends HTMLElement
  
> = ( ( props: P ) => IWidget<P, E> )

export type IComponentConstructor = ( ( props: any ) => IWidget<any, any> )





export type IAttributesMapValues = IAttributesMap | Array<any> | string  | number | boolean | null | (() => void)

export type IAttributesMap = {

  [ A : string ] : IAttributesMapValues
  
}

export type IAttributesAunrsed = {

    [ A : string ] : string;
    
}

export type IAttributesToggleMap = {

    [ A : string ] : boolean;
    
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

export interface IAttribute{

  attributeName : string;
  
  get entries() : string[];

  get value() : string;

  sync( attribute ?: string ) : this;

  add( value : string ) : this;

  remove( value : string ) : this;

  replace( older : string, value : string ) : this;

  contains( value : string ) : boolean;
  
  link() : this;

  unlink( property ?: string | string[] ) : this;
  
}




// export interface IKitEmitterScheme{

// }

export interface IKitProps{

  appearance: IAppearanceStyleSheet;

  component: IComponentConstructor;

}

// export interface IKit<P extends IWProps, E extends INode>{

//   emitter : IEmitter<IKitEmitterScheme>;
  
//   props : IKitProps<P, E> | undefined

//   render(): this;
  
// }





export type IViewEmitterCallbackArgument<C extends IWProps> = {

  component: IWidget<C, HTMLDivElement>;

  router: IView<C>
  
}

export type IViewEmitterCallback<C extends IWProps> = (

  payload : IViewEmitterCallbackArgument<C>
  
) => void


export interface IViewEmitters<C extends IWProps> {

  show?: IViewEmitterCallback<C>;

  hide?: IViewEmitterCallback<C>;
  
}


export interface IViewOptions<C extends IWProps>{

  name: string;
  
  title: string;

  presenter ?: 'normal' | 'modal' | 'overlay' | 'overlaySideLeft' | 'overlaySideRight';

  emitters ?: IViewEmitters<C>;

  transitions ?: {

    entry: ITransition;

    exit: ITransition;
    
  };

  // switcher ?: IViewSwitcher;

}


export interface IView<ComponentProps extends IWProps>{
  
  get parameters() : ComponentProps;
  
  get component() : IWidget<ComponentProps, HTMLDivElement> | undefined

  options : IViewOptions<ComponentProps>;
  
  componentConstructor : IComponentConstructor;

  show( parameters : ComponentProps ) : this;

  hide() : this;

  refresh( parameters ?: Partial<ComponentProps> | undefined ) : this;
  
  render() : IWidget<ComponentProps, HTMLDivElement>;
  
}




export type IStackViewsOptions<Scheme> = Omit<Partial<INavigationOptions<Scheme>>, 'middlewares'> & {

  index ?: keyof Scheme;

  canvas ?: IWTarget
  
  errorView ?: keyof Scheme;

  middlewares ?: INavigationMiddlewareCallback<Scheme>[];

}

export type IStackViewsList<Scheme> = {

  [ K in keyof Scheme ] : IView<any>
  
}

export interface IStackViewsEmitterScheme<Scheme>{

  error: keyof Scheme;
  
}

export interface IStackViews<Scheme>{

  get views(): IStackViewsList<Scheme>;

  emitter : IEmitter<IStackViewsEmitterScheme<Scheme>>

  options : IStackViewsOptions<Scheme>;
  
  navigation: INavigation<Scheme>;

  currentView() : IStackViewsList<Scheme>[keyof Scheme] | undefined;

  middleware( callback : INavigationMiddlewareCallback<Scheme> ) : this;

  // #defaultMiddleware( payload : INavigationMiddlewareProps<Scheme> ) : this;
  
  run(): this;
  
}





export type INavigationNavigateParser = 'hashtag' | 'directory'

export type INavigationNavigateProps<Scheme> = {

  navigation: INavigation<Scheme>;

  routeName: keyof Scheme;
  
  parser: INavigationNavigateParser;

}

export type INavigationMiddlewareProps<Scheme> = {

  navigation: INavigation<Scheme>;

  event: Event | undefined;

  parser: INavigationNavigateParser;

  routeName: keyof Scheme;

  args: Scheme[ keyof Scheme ] | IWProps | undefined;
  
}

export type INavigationMiddlewareCallback<Scheme> = ( 
  
  payload : INavigationMiddlewareProps<Scheme> 
  
) => void;


export type INavigationOptions<Scheme> = {

  useHashtagParser?: boolean;

  capture ?: boolean;

  middlewares?: INavigationMiddlewareCallback<Scheme>[]
  
}


export interface INavigationEmitterScheme<Scheme>{

  options: INavigation<Scheme>;

  navigate: INavigationNavigateProps<Scheme>;

} 


export interface INavigation<Scheme>{

  emitter: IEmitter<INavigationEmitterScheme<Scheme>>

  options: INavigationOptions<Scheme>;

  setOptions( options: INavigationOptions<Scheme> ) : this;

  setOption( optionName: keyof INavigationOptions<Scheme>, value : (INavigationMiddlewareCallback<Scheme>[] & boolean) | undefined ) : this;

  middleware( middleware : INavigationMiddlewareCallback<Scheme> ) : this;

  dispatchNavigate( ev ?: PopStateEvent | undefined ) : this;

  capturesActions() : this;

  isExternalURL( url : string ) : boolean;

  parseElementCaptured( event : Event ) : HTMLElement | undefined;

  currentRouteName() : keyof Scheme;

  oldRouteName() : keyof Scheme | undefined;

  currentQuery<T>() : T | undefined;

  observe() : this;

  navigate( 
    
    route : keyof Scheme, 
    
    props ?: Scheme[ keyof Scheme ], 
    
    ev?: PopStateEvent 
    
  ) : this;
  
}






// export type IViewSwitcherProps = {

//   entry ?: IAnimates;

//   exit ?: IAnimates;
  
// }

// export interface IViewSwitcher{

//   props : IViewSwitcherProps;

// }




// export type ITransitionEmitterScheme = {

//   done: IAnimate;
  
// }

export type ITransitionDoneCallback = ( transition : ITransition ) => void;

export type ITransitionType = 'entry' | 'exit';

export type ITransitionProps = {

  whenEntry: (target: IAnimateTarget) => IAnimate;

  whenExit: (target: IAnimateTarget) => IAnimate;
  
}

export interface ITransition{

  in( target : IAnimateTarget, done: ITransitionDoneCallback ) : IAnimate;

  out( target : IAnimateTarget, done: ITransitionDoneCallback ) : IAnimate;
  
}






export type IAnimateInterpolarities = number[][]

export type IAnimateInterpolarity = number[]

export type IAnimateHitCallbackProps = {
  
  interpolarity: number[];
  
  animate: IAnimate; 
  
  percent: number 

}

export type IAnimateHitCallback = ( props : IAnimateHitCallbackProps ) => void

export type IAnimateEmitterScheme = {

  ready: IAnimateInterpolarities;

  start: IAnimateInterpolarities;

  done: IAnimateInterpolarities;

  stop: IAnimate;

  loop: IAnimate;

  hit: IAnimateHitPayload;
  
}

export type IAnimateHit = {

  interpolate : number[];
  
  engine : IAnimate;
  
  percent : number;
  
}

export type IAnimateOptions = {

  from: number[],
  
  to: number[],
  
  duration: number,
  
  frame?: number,

  loop?: boolean | number
  
  start?: ( engine: IAnimate ) => void
  
  hit?: IAnimateHitCallback
  
  done?: (engine: IAnimate) => void
  
}


export type IAnimateElementProperties = Array<keyof CSSStyleDeclaration>;

export type IAnimateElementPattern = (( value: number) => string) | null

export type IAnimateElementOptions = {

  target: IAnimateTarget;
  
  from ?: number[];
  
  to ?: number[];
  
  duration ?: number;

  properties ?: IAnimateElementProperties;

  patterns ?: IAnimateElementPattern[];
  
}


export type IAnimateProps = {

  animates: IAnimate[]
  
  // target:{

  //   entry: IElement<HTMLElement>;

  //   exit: IElement<HTMLElement>;
    
  // }
  
}

export type IAnimateTarget = IElement<HTMLElement>;

export type IAnimateConstructor = ( target : IAnimateTarget, callback : IAnimateCallback ) => IAnimate

export type IAnimatePayload = {

  animate : IAnimate;
   
  target : IElement<HTMLElement>
  
}

export type IAnimateHitPayload = {

  interpolate: IAnimateInterpolarity;

  engine: IAnimate;

  percent: number;
  
}

export type IAnimateCallback = ( payload :IAnimatePayload  ) => IAnimate;


export interface IAnimate{

  options: IAnimateOptions;

  defaultFrame: number;

  interpolarities : IAnimateInterpolarities;

  state : number;

  loopState : number;

  status : boolean;

  emitter : IEmitter<IAnimateEmitterScheme>;


  clean(): this;

  reset(options: IAnimateOptions): this;

  create(options: IAnimateOptions): this;

  element(options:IAnimateElementOptions) : this;

  stop(): this;

  restart(): this;

  play(): this;
  
}


export interface IAnimates{

}