declare module '@protorians/aun/exceptions' {
  import { IWidgerErrorException } from "@protorians/aun/types";
  export class WidgetErrorException extends Error implements IWidgerErrorException {
      message: string;
      constructor(message: string);
      messageToString(data: string): string;
  }

}
declare module '@protorians/aun/foundations' {
  import EventDispatcher from "@protorians/core/event-dispatcher";
  import type { IAttributesMap, IChildren, IComponentConstructor, IConstruct, IConstructEmitterScheme, IElement, IElementClassName, IElementCSS, IElementCSSRemoves, IElementEmitterScheme, IElementEventCallback, IElementMeasureCallback, IElementOffsetCallback, IFindElementCallback, INode, IStackViews, IStackViewsEmitterScheme, IStackViewsList, IStackViewsOptions, IState, IStateCallback, IStateErrorCallback, IStateManager, IStateManagerEmitterScheme, IStateRecords, IView, IViewOptions, IWidget, IWidgetEmitterScheme, IWidgetLayerCallback, IWidgetReadyCallback, IWidgetRequestAnimationFrameCallback, IWidgetTimerCallback, IWTarget, IWTargetNode, IStateVoidCallback, IWidgetStandardProps } from "@protorians/aun/types";
  import type { IAppearance, IAppearanceObject, IEventDispatcher, IEventDispatcherCallback, INavigation, INavigationMiddlewareCallback } from "@protorians/core/types";
  /**
   * findElement — Find Element
   * @param find Recherché
   * @param callback Fonction de rappel contenant l'element html en argument
   */
  export function findElement(find: IWTarget | undefined, callback?: IFindElementCallback): IWTargetNode | undefined;
  /**
   * AUN Element
   * @description Encapscule l'lement HTML pour un usage optimal
   * @example AunElement<HTMLDivElement>('div')
   */
  export class AunElement<E extends INode> implements IElement<E> {
      #private;
      /**
       * Instance contenant le DOM
       */
      instance: E;
      /**
       * Emetteur
       */
      emitter: EventDispatcher<IElementEmitterScheme>;
      /**
       * Widget associé
       */
      get widget(): IWidget<any, E> | undefined;
      constructor(tagname: string);
      /**
       * own
       * @description Définit le widget propriétaire de l'élément
       * @param widget Widget Cible
       * @example element.own( widget )
       */
      own<P extends IWidgetStandardProps>(widget: IWidget<P, E>): this;
      /**
       * asyncMeasure
       * @description Retrouve les dimension et le position de l'instance de l'élément en retournant les valeurs.
       * Ceci permet d'enchaine avec une autre methode
       * @example element.asyncMeasure()
       */
      asyncMeasure(): DOMRect;
      /**
       * measure
       * @description Execute asyncMeasure mais avec un callback
       * @param callback Fonction de rappel retournant la valeur en argument
       * @example element.measure( measure => ... )
       */
      measure(callback: IElementMeasureCallback): this;
      data(key: string, value: string): this;
      /**
       * clean
       * @description Nettoie le contenu de l'instance de l'élément
       * @example element.clean()
       */
      clean(): this;
      /**
       * remove
       * @description Supprime l'élément
       * @example element.remove()
       */
      remove(): this;
      /**
       * asyncOffset
       * @description Retrouve les valeurs de l'`offset` de l'intance de l'élément en les retournant
       * @example element.asyncOffset()
       */
      asyncOffset(): {
          height: number;
          width: number;
          top: number;
          left: number;
          parent: Element | null;
      };
      /**
       * offset
       * @description Exécute `asyncOffset` mais avec une fonction de rappel.
       * Ceci permet d'enchaine avec une autre methode
       * @param callback Fonction de rappel retournant la valeur en argument
       * @example element.offset( offset => ... )
       */
      offset(callback: IElementOffsetCallback): this;
      /**
       * content
       * @description Ajoute un contenu à l'élément. Ou Retourne les enfants du widget propriétaire.
       * @param child Enfant à ajouter
       * @example
       * element.content( undefined ) // Retourne les enfants du widget propriétaire
       * element.content( 'string' )
       * element.content( widget )
       * element.content( [ widget1, widget2, ... ] )
       */
      content(child?: IChildren | IChildren[] | undefined): string | number | boolean | HTMLElement | IStateManager<IState> | IWidget<any, any> | Promise<IWidget<any, any>> | IChildren[] | this | null | undefined;
      /**
       * html
       * @description Définit un contenu HTML dans l'élément
       * @param data Contenu HTML
       * @example
       * element.html( 'string' )
       */
      html(data?: string | undefined): string | this;
      /**
       * append
       * @description Ajout un noeud ou une chaine de caratère à l'élément
       * @param nodes Noeud ou chaine de caratère
       * @example
       * element.append( 'string' )
       * element.append( document.querySelector('.box') )
       */
      append(...nodes: (string | Node)[]): this;
      /**
       * listen
       * @description Écoute l'emetteur gréffé à l'élément
       * @param type Type d'émission
       * @param callback Fonction de rappel retournant la valeur associé au `type`
       * @example
       * element.listen( 'EMITTER_TYPE', data => ... )
       * element.listen<IElementEmitterScheme>( 'EMITTER_TYPE', data => ... )
       */
      listen<L extends keyof IElementEmitterScheme>(type: L, callback: IEventDispatcherCallback<IElementEmitterScheme[L]>): this;
      /**
       * on
       * @description Écoute les évènement gréffé à l'instance de l'élément
       * @param type
       * @param callback
       * @param options
       * @example
       * element.on<PointerEvent>( 'LISTENER_TYPE', ev => ... )
       */
      on<T extends keyof HTMLElementEventMap>(type: T, callback: IElementEventCallback<T>, options?: AddEventListenerOptions | boolean | undefined): this;
      /**
       * style
       * @description Définit le style de l'instance lié à l'élément
       * @param properties Propriétés et valeurs à définir
       * @example
       * element.style( {
       *    'property': 'value'
       * } )
       */
      style(properties: IElementCSS | undefined): this;
      /**
       * removeStyle
       * @description Suprrime les propriétés de style de l'instance lié à l'élément
       * @param properties Tableau des propriétés à supprimer
       * @example
       * element.removeStyle( [ 'color', 'fontSize', ... ])
       */
      removeStyle(properties: IElementCSSRemoves): this;
      /**
       * toggle
       * @description Basculer sur une selecteur CSS ou pas
       * @param tokens Selecteur ou liste de sélecteur
       * @example
       * element.toggle( '.box' )
       * element.toggle( ['.box', '.card', ... ] )
       */
      toggleClassname(tokens: IElementClassName): this;
      addInlineClassname(tokens: string): this;
      /**
       * className
       * @description Associé un selecteur CSS
       * @param tokens Selecteur CSS
       */
      classname(tokens: IElementClassName | undefined): this;
      getClassname(): string[];
      /**
       * removeClassName
       * @description Supprimer un selecteur CSS
       * @param tokens Selecteur CSS
       */
      removeClassname(tokens: IElementClassName): this;
      /**
       * attribute
       * @description Definit le/les attribut(s)
       * @param attributes Attributs sous form d'object
       * @param ns Nom de l'espace
       * @param separator Séparateur de nom d'espace
       */
      attribute(attributes?: IAttributesMap | undefined, ns?: string | undefined, separator?: string | undefined): this;
      /**
       * attribute
       * @description Definit le/les attribut(s)
       * @param attributes Attributs sous form d'object
       * @param ns Nom de l'espace
       * @param separator Séparateur de nom d'espace
       */
      attributeNS(attributes?: IAttributesMap | undefined, ns?: string | undefined): this;
      /**
       * removeAttribute
       * @description Supprime le/les attribut(s)
       * @param attributes Attributs sous form d'object
       * @param ns Nom de l'espace
       * @param separator Séparateur de nom d'espace
       */
      removeAttribute(attributes: IAttributesMap, ns?: string | undefined, separator?: string | undefined): this;
      /**
       * toggleAttribute
       * @description Basculer le/les attribut(s)
       * @param attributes Attributs sous form d'object
       * @param ns Nom de l'espace
       * @param separator Séparateur de nom d'espace
       */
      toggleAttribute(attributes: IAttributesMap, ns?: string | undefined, separator?: string | undefined): this;
  }
  /**
   * AUN State
   * @description Gestionnaire d'état
   */
  export class AunState<S extends IState> implements IStateManager<S> {
      #private;
      /**
       * Donnée de l'état
       */
      state: S;
      /**
       * Emetteur
       */
      emitter: EventDispatcher<IStateManagerEmitterScheme<S>>;
      /**
       * Retourne la valeur de l'état
       */
      get value(): S;
      constructor(state: S);
      /**
       * initialize
       * @description Initialise l'état
       */
      initialize(): this;
      change(callback: IStateVoidCallback<S>): this;
      /**
       * set
       * @description Modifit l'état
       * @param value Nouvelle valeur de l'état
       * @example
       * state.set( ... )
       */
      set(value: S): this;
      /**
       * use
       * @description Utilise l'état
       * @param callback Fonction de rappel contenant l'état en paramètre. Cett fonction doit retourner un widget
       * @example
       * state.use( state => ... )
       */
      use(callback: IStateCallback<S>): this;
      /**
       * records
       * @description Enregistre les déclarations de l'état pour le référencement
       * @param widget Widget enregistré
       * @example
       * state.records( ... )
       */
      records(widget: IWidget<any, any>): this;
      /**
       * record
       * @description Engistre la déclaration du widget
       * @param widget Widget
       * @param record Enregistrement de la déclaration
       * @example
       * state.record( widget, record )
       */
      record(widget: IWidget<any, HTMLElement>, record: IStateRecords<any>): IStateRecords<any>;
      /**
       * sync
       * @description Synchronise l'état et les déclarations
       * @example
       * state.sync()
       */
      sync(): this;
      /**
       * catch
       * @description Gestion des érreurs
       * @param callback Fonction de rappel. Cette fonction doit retrouner un Widget
       * @example
       * state.catch( error => ... )
       */
      catch(callback: IStateErrorCallback<S>): this;
  }
  /**
   * AUN Widget
   * @description Pour les composant HTML de base
   */
  export class AunWidget<P extends IWidgetStandardProps, E extends INode> implements IWidget<P, E> {
      #private;
      /**
       * Instance de l'élément
       */
      element: IElement<E>;
      /**
       * Enfant du widget
       */
      child?: IChildren | IChildren[] | undefined;
      /**
       * Les propriétés
       */
      get props(): P;
      /**
       * Emetteur
       */
      emitter: EventDispatcher<IWidgetEmitterScheme<P, E>>;
      /**
       * Constructe
       */
      construct: IConstruct<P, E>;
      constructor(tagname: string, props: P);
      append(...nodes: Array<string | Node>): this;
      ready(callback: IWidgetReadyCallback<P, E>): this;
      manipulate(callback: IWidgetLayerCallback<E>): this;
      /**
       * appear
       * @description Definit une apparence pour le widget
       * @param payload Propriété de l'apparence
       * @example
       * widget.appear( {
       *    'property' : 'value'
       * } )
       */
      appear(payload: IAppearanceObject): this;
      /**
       * content
       * @description Definit le contenu du widget
       * @param child Contenu du widget
       * @example
       * widget.content( ... )
       */
      content(child?: IChildren | IChildren[] | undefined): this | IChildren;
      /**
       * refresh
       * @description Rafraichit un widget
       * @example
       * widget.refresh()
       */
      refresh(props?: Partial<P> | undefined): this;
      /**
       * render
       * @description Rend le widget
       */
      render(): this;
      /**
       * remove
       * @description Détruit le widget
       */
      remove(): this;
      /**
       * timeOut
       * @description Execute une fonction après un temps donnée
       * @param callback Fonction de rappel retournant un widget et le timer
       * @param time Durée du compte à rebour
       * @example
       * widget.timeOut( ( widget, timer ) => ... )
       */
      timeOut(callback: IWidgetTimerCallback, time?: number): this;
      /**
       * timeInterval
       * @description Execute une fonction à un interval de temps
       * @param callback Fonction de rappel retournant un widget et le timer
       * @param time Durée de l'interval
       * @example
       * widget.timeInterval( ( widget, timer ) => ... )
       */
      timeInterval(callback: IWidgetTimerCallback, time?: number): this;
      /**
       * frameReady
       * @description Execute une fonction quand permet l'animation des frames
       * @param callback Fonction de rappel appelent un widget en argument
       * @example
       * widget.frameReady( widget => ... )
       */
      frameReady(callback: IWidgetRequestAnimationFrameCallback): this;
  }
  /**
   * AUN Construct
   * @description Constructeur de Widget
   */
  export class AunConstruct<P extends IWidgetStandardProps, E extends INode> implements IConstruct<P, E> {
      /**
       * Emetteur
       */
      emitter: EventDispatcher<IConstructEmitterScheme<P, E>>;
      /**
       * Apparence
       */
      appearance: IAppearance;
      constructor();
      /**
       * make
       * @description Créer le constructeur
       * @param root Racine Widget
       * @param child Enfants à ajouter
       */
      make(root: IWidget<P, E>, child: IChildren): IWidget<P, E>;
      makeRoot(root: IWidget<P, E>): IWidget<P, E>;
      propertyBuilder(root: IWidget<P, E>, slug: keyof IWidgetStandardProps, value: any): this;
      /**
       * makeChildren
       * @description Construire les enfants
       * @param root Racine Widget
       * @param child Enfants à ajouter
       */
      makeChildren(root: IWidget<P, E>, child: IChildren): IWidget<P, E>;
      /**
       * makeAppearance
       * @description Construire l'apparence
       * @param root
       * @param payload
       */
      makeAppearance(root: IWidget<P, E>, payload: IAppearanceObject): IWidget<P, E>;
  }
  export class AunView<ComponentProps extends IWidgetStandardProps> implements IView<ComponentProps> {
      #private;
      get parameters(): ComponentProps;
      get component(): IWidget<ComponentProps, HTMLDivElement> | undefined;
      options: IViewOptions<ComponentProps>;
      componentConstructor: IComponentConstructor;
      constructor(componentConstructor: IComponentConstructor, options?: IViewOptions<ComponentProps>);
      show(parameters: ComponentProps): this;
      hide(): this;
      refresh(parameters?: Partial<ComponentProps> | undefined): this;
      render(): IWidget<ComponentProps, HTMLDivElement>;
  }
  export class AunStackViews<Scheme> implements IStackViews<Scheme> {
      #private;
      /**
       * Les vues
       */
      get views(): IStackViewsList<Scheme>;
      /**
       * Composant Actuellement utilisé
       */
      get current(): IWidget<any, any> | undefined;
      /**
       * Dernier composant utilisé
       */
      last: IWidget<any, any> | undefined;
      /**
       * Options
       */
      options: IStackViewsOptions<Scheme>;
      /**
       * Système de navigation
       */
      navigation: INavigation<Scheme>;
      /**
       * Emétteur
       */
      emitter: IEventDispatcher<IStackViewsEmitterScheme<Scheme>>;
      constructor(views: IStackViewsList<Scheme>, options: IStackViewsOptions<Scheme>);
      middleware(callback: INavigationMiddlewareCallback<Scheme>): this;
      /**
       * Démarrage
       */
      run(): this;
  }

}
declare module '@protorians/aun/index' {
  import { AunElement, AunState, AunWidget, AunView } from "@protorians/aun/foundations";
  import { AUNWindow, IChildren, IComponentConstructor, IHydrateComponent, IKitProps, IImageProps, INode, IStackViewsList, IStackViewsOptions, IState, IViewOptions, IWidget, IWidgetAsyncCallback, IWTarget, ITextProps, IWidgetStandardProps, IInputProps, IFormProps, IModalProps, IButtonProps, IWidgetProps, IStackViews, IVideoProps, IAudioProps, IIFrameProps, IWidgetTableCellProps, IWidgetTableSectionProps, IWidgetGlobalStandardProps, IWidgetTableProps, IWidgetHTMLGlobalProps } from "@protorians/aun/types";
  import { IProps } from "@protorians/core/types";
  /**
   * WidgetWhitelistProps
   * @description Liste des propriétés réservés aux traitement des widgets
   */
  export const WidgetWhitelistProps: string[];
  /**
   * setWidgetProperty
   * @param widget Widget cible
   * @param props Propriété à analyser
   */
  export function setWidgetProperty<P extends IProps, H extends HTMLElement>(widget: IWidget<P, H>, props: IProps): IWidget<P, H>;
  /**
   * CreateState
   * @description Instance fonctionnelle d'usage de gestion des états AUN
   * @param state Valeur par default de l'état
   * @example CreateState<StateType>( stateValue )
   */
  export function CreateState<S extends IState>(state: S): AunState<S>;
  /**
   * DropComponent
   * @param target Balise HTML cible où deposer le composant. La valeur peut être un Element HTML ou une requete de selecteur
   * @param component Composant à deposer
   * @description Lier un composant à une cicle
   * @example DropComponent<PropsType>( '#root', Component( { ... } ) )
   * DropComponent<PropsType>( document.getElementById('root'), Component( { ... } ) )
   */
  export function DropComponent<P extends IWidgetStandardProps, E extends INode>(component: IWidget<P, E>, target: INode): IWidget<P, E>;
  /**
   * DropComponents
   * @description Lier plusieurs composants à plusieurs cicles.
   * @param targets Balises HTML cible où deposer le composant. La valeur peut être un Element HTML ou une requete de selecteur. Instancie plusieurs cicle à la fois.
   * @param component Composant à deposer dans l'élément HTML
   * @example DropComponents<PropsType, HTMLDivElement>( '.drop-target', ( props : Props ) => ... )
   */
  export function DropComponents<P extends IWidgetStandardProps, E extends INode>(component: IWidget<P, E>, targets: NodeListOf<INode>): IWidget<P, E>;
  /**
   * AsyncComponent
   * @description Utiliser un composant avec une promesse. Composant bloquant en attendant le traitement. Il peut être ajouter aux enfants d'un widget
   * @param callback Fonction de renvoie pour le traitement d'un promesse. Puis renvoyer un composant instancié
   * @example AsyncComponent( ( resolve, reject ) => {
   *    setTimeout( () => resolve( component() ), 3000 )
   * })
   */
  export function AsyncComponent<P extends IWidgetStandardProps, E extends INode>(callback: IWidgetAsyncCallback): Promise<IWidget<P, E>>;
  /**
   * UseComponent
   * @description Utiliser un composant dans une / plusieurs cibles
   * @param target Balises HTML cible où deposer le composant. La valeur peut être un Element HTML ou une requete de selecteur. Instancie plusieurs cicle à la fois.
   * @param component Composant instancié
   * @example UseComponent<PropsType>( '#root', component( props ) ) // Requête de selecteur pour la cible
   * UseComponent<PropsType>( document.getElementById('root'), component( props ) ) // Instance de type HTMLElement pour la cible
   */
  export function UseComponent<P extends IWidgetStandardProps, E extends INode>(component: IWidget<any, any>, target: IWTarget): IWidget<P, E>;
  /**
   * CreateKit
   * @description Créer un Kit Composant
   * @param definition Définition du Kit
   * @example
   * CreateKit( {
   *    appearance: { ... }
   *    component: ( props : Props ) => ...
   * } )
   */
  export function CreateKit(definition: IKitProps): <P extends IWidgetStandardProps, E extends HTMLElement>(p: P) => IWidget<P, E>;
  /**
   * aune — AUN Virtual Element
   * @description Instance fonctionnelle d'usage des éléments AUN
   * @param tagname Nom de la balise HTML
   * @example aun<HTMLSpanElement>( 'span' )
   */
  export function aune<E extends INode>(tagname: string): AunElement<E>;
  /**
   * RawWidget
   * @description Instance fonctionnelle d'usage des Widgets AUN
   * @param tagname Nom de la balise HTML
   * @param props Propriétés du widget
   * @example RawWidget<PropsType, HTMLSpanElement>( 'span', props )
   */
  export function RawWidget<P extends IWidgetStandardProps, E extends INode>(tagname: string, props: P): AunWidget<P, E>;
  /**
   * Widget
   * @description Créer une couche de calque
   * @param props Propriétés du widget. La propriété `child` représente les enfants du widget (contenu)
   * @example Widget<PropsType>({
   * child: ...
   * otherProp: ...
   * })
   */
  export function Widget(props: IWidgetProps): IWidget<IWidgetProps, HTMLDivElement>;
  /**
   * CreateCustomWidget
   * @description Créer un widget Personnalisé
   * @param tagname nom de la balise encapsulé
   * @param props Propriétés
   */
  export function CreateCustomWidget<P extends IProps, H extends HTMLElement>(tagname: string, props: P): IWidget<P, H>;
  /**
   * Textual
   * @description Calque destiné aux textes
   * @param props Propriétés du widget. La propriété `child` représente contenu de type string
   * @example Textual<PropsType>({
   * child: ...
   * otherProp: ...
   * })
   */
  export function TextWidget(props: ITextProps): IWidget<ITextProps, HTMLSpanElement>;
  /**
   * Image
   * @description Calque aus images
   * @param props Propriétés du widget.
   * @example ImageWidget<PropsType>({
   * src: ...
   * })
   */
  export function ImageWidget(props: IImageProps): IWidget<IImageProps, HTMLImageElement>;
  /**
   * InputWidget
   * @description Calque de champs de texte
   * @param props Propriétés de champs de texte
   * @example
   * InputWidget({
   *    type: 'text',
   *    value: 'content',
   *    ...
   * })
   */
  export function InputWidget(props: IInputProps): IWidget<IInputProps, HTMLInputElement>;
  /**
   * VideoWidget
   * @param props Propriétés
   */
  export function VideoWidget(props: IVideoProps): IWidget<IVideoProps, HTMLVideoElement>;
  /**
   * VideoWidget
   * @param props Propriétés
   */
  export function AudioWidget(props: IAudioProps): IWidget<IAudioProps, HTMLAudioElement>;
  /**
   * iFrameWidget
   * @param props Propriétés
   * @example
   * iFrameWidget({
   *    src: 'example.html'
   * })
   */
  export function iFrameWidget(props: IIFrameProps): IWidget<IIFrameProps, HTMLIFrameElement>;
  /**
   * ButtonWidget
   * @param props Propriétés
   * @example
   * ButtonWidget({
   *    child: ...
   * })
   */
  export function ButtonWidget(props: IButtonProps): IWidget<IButtonProps, HTMLButtonElement>;
  /**
   * FormWidget
   * @description Calque de Formulaire
   * @param props Propriétés de formulaire
   * @example
   * FormWidget({
   *    method: 'post',
   *    action: 'publish',
   * })
   */
  export function FormWidget(props: IFormProps): IWidget<IFormProps, HTMLFormElement>;
  /**
   * TableCellWidget
   * @param props Propriétés
   */
  export function TableCellWidget(props: IWidgetTableCellProps): IWidget<IWidgetTableCellProps, HTMLTableCellElement>;
  /**
   * TableRowWidget
   * @param props Propriétés
   */
  export function TableRowWidget(props: IWidgetTableSectionProps): IWidget<IWidgetTableSectionProps, HTMLTableRowElement>;
  /**
   * TableHeadWidget
   * @param props Propriétés
   */
  export function TableHeaderWidget(props: IWidgetTableCellProps): IWidget<IWidgetTableCellProps, HTMLTableCellElement>;
  /**
   * TableHeadWidget
   * @param props Propriétés
   */
  export function TableHeadWidget(props: IWidgetTableCellProps): IWidget<IWidgetTableCellProps, HTMLTableCellElement>;
  /**
   * TableBodyWidget
   * @param props Propriétés
   */
  export function TableBodyWidget(props: IWidgetTableSectionProps): IWidget<IWidgetTableSectionProps, HTMLTableSectionElement>;
  /**
   * TableFootWidget
   * @param props Propriétés
   */
  export function TableFootWidget(props: IWidgetTableSectionProps): IWidget<IWidgetTableSectionProps, HTMLTableSectionElement>;
  /**
   * TableCaptionWidget
   * @param props Propriétés
   */
  export function TableCaptionWidget(props: IWidgetGlobalStandardProps): IWidget<IWidgetGlobalStandardProps, HTMLTableCaptionElement>;
  /**
   * TableWidget
   * @description Créer un tableau
   * @param props
   */
  export function TableWidget(props: IWidgetTableProps): IWidget<IWidgetHTMLGlobalProps, HTMLTableElement>;
  export function ModalWidget(props: IModalProps): IWidget<IModalProps, HTMLFormElement>;
  /**
   * View
   * @param component Composant utilisé pour la vue
   * @param options Options de la vue
   */
  export function View<C extends IWidgetStandardProps>(component: IComponentConstructor, options?: IViewOptions<C> | undefined): AunView<C>;
  export function CreateStackViews<Scheme>(views: IStackViewsList<Scheme>, options?: IStackViewsOptions<Scheme>): IStackViews<Scheme>;
  /**
   * CurrentStackViews
   * @description Obtenir la pile de vues actuelle
   */
  export function CurrentStackViews<Scheme>(): IStackViews<Scheme>;
  /**
   * AUN Construct
   * @description Construire un composant à partir des enfants
   * @param component Composant cible
   * @param child Enfant à injecter
   * @example Construct<ComponentType>( component, child )
   * Construct( component, child )
   */
  export function Construct<Component extends IWidget<IWidgetStandardProps, INode>>(component: Component, child: IChildren): IWidget<IWidgetStandardProps, HTMLElement>;
  /**
   * CreateComponent
   * @description Créer un composant en ajoutant immédiatement à la fil d'attente hydratation tout en permetant de l'exporter avec un nom d'emprunt.
   * @param name
   * @param widgetConstructor
   * @example export const HelloWord = CreateComponent<PropType>('HelloWorld', ( props : IWidgetStandardProps ) => ... )
   */
  export function CreateComponent<P extends IWidgetStandardProps>(name: string, widgetConstructor: IHydrateComponent<any, HTMLElement>): IHydrateComponent<P, HTMLElement>;
  /**
   * HydrateComponentQueue
   * @description Fil d'attente des hydration des composants AUN
   * @param name CNom du composant. Sensible à la case
   * @param widgetConstructor Constructeur du composant AUN
   * @example HydrateComponentQueue<WidgetPropsType>( 'ComponentName', ( props : WidgetProps ) => ... )
   */
  export function HydrateComponentQueue<P extends IWidgetStandardProps>(name: string, widgetConstructor: IHydrateComponent<any, HTMLElement>): IHydrateComponent<any, HTMLElement>;
  /**
   * HydrateComponent
   * @param name Chaine de caratère représentant le nom du composant. Sensible à la case
   * @param widgetConstructor Constructeur du composant AUN
   * @example HydrateComponent<PropsType>( 'Hello', HelloComponent )
   */
  export function HydrateComponent<P extends IWidgetStandardProps>(name: string, widgetConstructor: IHydrateComponent<any, HTMLElement>): IHydrateComponent<any, HTMLElement>;
  /**
   * ExtractProps
   * @description Extraction des propriétés dans le constructeur d'un composant
   * @param attributes Contenu de la propriété "HTMLElement.attributes"
   * @example ExtractProps<PropsType>( element.attributes )
   */
  export function ExtractProps<P extends IWidgetStandardProps>(attributes: NamedNodeMap): P;
  /**
   * ActiveAutoHydrateComponents
   * @description Active l'hydratation automatique des composants
   * @example ActiveAutoHydrateComponents()
   */
  export function ActiveAutoHydrateComponents(): MutationObserver;
  /**
   * AUN
   * @description Exportations des fonctionnalités de base du framework
   */
  export default class AUN {
      /**
       * Instance
       * @alias Window aslias de l'object window avec le types des données de AUN
       */
      static Instance: AUNWindow;
      /**
       * aune — AUN Virtual Element
       * @alias aune
       * @description Instance fonctionnelle d'usage des éléments AUN
       */
      static Element: typeof aune;
      /**
       * RawWidget
       * @alias RawWidget
       * @description Instance fonctionnelle d'usage des Widgets AUN
       */
      static RawWidget: typeof RawWidget;
      /**
       * Construct
       * @alias Construct
       * @description Construire un composant via AunConstruct
       */
      static Construct: typeof Construct;
      /**
       * Widget
       * @alias Widget
       * @description Créer une couche de calque
       */
      static Widget: typeof Widget;
      /**
       *
       */
      static InputWidget: typeof InputWidget;
      /**
       * Textual
       * @alias TextWidget
       * @description Calque destiné aux textes
       */
      static Textual: typeof TextWidget;
      /**
       * CreateState
       * @description Instance fonctionnelle d'usage de gestion des états AUN
       */
      static CreateState: typeof CreateState;
      /**
       * DropComponent
       * @description Lier un composant à une cicle
       */
      static DropComponent: typeof DropComponent;
      /**
       * DropComponents
       * @description Lier plusieurs composants à plusieurs cicles
       */
      static DropComponents: typeof DropComponents;
      /**
       * AsyncComponent
       * @description Utiliser un composant avec une promesse. Composant bloquant en attendant le traitement.
       */
      static AsyncComponent: typeof AsyncComponent;
      /**
       * UseComponent
       * @description Utiliser un composant dans une / plusieurs cibles
       */
      static UseComponent: typeof UseComponent;
  }

}
declare module '@protorians/aun/types' {
  /// <reference types="node" />
  import type { IAppearance, IAppearanceObject, IAppearanceStyleSheet, IEventDispatcher, IEventDispatcherCallback, INavigation, INavigationMiddlewareCallback, INavigationOptions, IProps } from "@protorians/core/types";
  import { ICoreTransition } from "@protorians/core/types";
  export interface AunNode {
      AUNAOD?: boolean;
  }
  export type AUNWindow = Partial<Window> & {
      /**
       * Stockage des composant crée
       */
      AUNRC?: IRegistryComponentConstructorStack;
      /**
       * Stockage des Observateurs de mutation pour l'hydratation des composants
       */
      AUNHW?: MutationObserver;
      CurrentStackViews?: IStackViews<any> | undefined;
  };
  export type IChild = string | number | boolean | null | IStateManager<IState> | IWidget<any, any> | HTMLElement | undefined;
  export type IChildren = IChild | Promise<IWidget<any, any>> | Array<IChild | Promise<IWidget<any, any>>> | Array<IChildren>;
  export type IChildElement = IStateManager<IState> | IWidget<any, any> | HTMLElement | undefined;
  export type IChildrenElement = IChildElement | Promise<IWidget<any, any>> | Array<IChildElement | Promise<IWidget<any, any>>> | Array<IChildElement> | undefined;
  export type INode = HTMLElement;
  export type INodeLayer = HTMLDivElement;
  export type INodeText = HTMLSpanElement;
  export type IWTarget = string | INode | NodeListOf<INode> | IElement<INode>;
  export type IWTargetNode = INode | NodeListOf<INode> | IElement<INode>;
  export type IFindElementCallback = (element: HTMLElement) => void;
  export interface IRegistryComponentConstructorStack {
      [K: string]: (props: any) => IWidget<any, any>;
  }
  export type IObjectToString = {
      eq?: string | undefined;
      start?: string | undefined;
      end?: string | undefined;
      joiner?: string | undefined;
  };
  export interface IWidgetAttributeProps {
      attributes: IAttributesMap;
      ns?: string | undefined;
      separator?: string | undefined;
  }
  export interface IWidgetAttributeNSProps {
      attributes: IAttributesMap;
      ns?: string | undefined;
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
  export type IWidgetTableColumnData = string | number | boolean | null | undefined;
  export type IWidgetTableDataPayload = {
      index: number;
      value: IWidgetTableColumnData;
  };
  export type IWidgetTableDataCallback = (payload: IWidgetTableDataPayload) => IWidget<any, any>;
  export interface IWidgetTableProps extends IProps {
      table?: IWidgetHTMLGlobalProps;
      caption?: IWidget<any, any>;
      headers: IWidgetTableColumnData[];
      body?: IWidgetTableColumnData[][];
      foots?: IWidgetTableColumnData[][];
      headerItemWidget?: IWidgetTableDataCallback;
      bodyItemWidget?: IWidgetTableDataCallback;
      footerItemWidget?: IWidgetTableDataCallback;
  }
  export interface IWidgetTableCellProps extends IWidgetStandardProps, IWidgetHTMLGlobalProps {
      child?: IChildren | IChildrenElement;
      abbr?: string;
      headers?: string;
      colspan?: number;
      rowspan?: number;
      scope?: 'col' | 'colgroup' | 'row' | 'rowgroup';
  }
  export interface IWidgetTableSectionProps extends IWidgetStandardProps, IWidgetHTMLGlobalProps {
      child?: IChildren | IChildrenElement;
  }
  /**
   * ITextProps extends IWidgetStandardProps
   * @description Propriétés des textes de widget
   */
  export interface ITextProps extends IWidgetStandardProps, IWidgetHTMLGlobalProps {
      child: string;
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
      rel?: 'external' | 'license' | 'next' | 'nofollow' | 'noopener' | 'noreferrer' | 'opener' | 'prev' | 'search' | 'help';
      target?: '_blank' | '_parent' | '_top' | '_self';
      child: IChildElement;
  }
  export interface IButtonProps extends IWidgetStandardProps, IWidgetHTMLGlobalProps {
      type?: 'button' | 'submit' | 'reset';
      child: IChildren;
  }
  export interface IInputProps extends IWidgetStandardProps, IWidgetHTMLGlobalProps {
      type?: 'text' | 'button' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'time' | 'url' | 'week' | 'checkbox';
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
      formtarget?: '_blank' | '_self' | '_parent' | '_top' | string;
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
      listen<L extends keyof IElementEmitterScheme>(type: L, callback: IEventDispatcherCallback<IElementEmitterScheme[L]>): this;
      on<T extends keyof HTMLElementEventMap>(type: T, callback: IElementEventCallback<T>, options?: AddEventListenerOptions | boolean | undefined): this;
      style(tokens: IElementCSS | undefined): this;
      removeStyle(tokens: IElementCSSRemoves): this;
      toggleClassname(tokens: IElementClassName): this;
      addInlineClassname(tokens: string): this;
      classname(tokens: IElementClassName | undefined): this;
      getClassname(): string[];
      removeClassname(tokens: IElementClassName): this;
      attribute(tokens?: IAttributesMap | undefined, ns?: string | undefined, separator?: string | undefined): this;
      attributeNS(tokens?: IAttributesMap | undefined, ns?: string | undefined): this;
      removeAttribute(tokens: IAttributesMap, ns?: string | undefined, separator?: string | undefined): this;
      toggleAttribute(tokens: IAttributesMap, ns?: string | undefined, separator?: string | undefined): this;
  }
  export type IElementCSS = Partial<CSSStyleDeclaration>;
  export type IElementCSSRemoves = keyof IElementCSS | Array<keyof IElementCSS>;
  export type IElementListenerCallback = () => void;
  export type IElementEventCallback<T extends keyof HTMLElementEventMap> = (args: HTMLElementEventMap[T]) => void;
  export type IElementClassName = string[] | string;
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
          options: AddEventListenerOptions | boolean | undefined;
      };
      style: IElementCSS;
      removeStyle: IElementCSSRemoves;
      toggle: IElementClassName;
      append: Array<string | Node>;
      className: IElementClassName;
      removeClassName: IElementClassName;
  }
  export type IElementMeasureCallback = (offset: DOMRect) => void;
  export type IElementOffsetCallback = (offset: IElementOffset) => void;
  export type IElementOffset = {
      height: number;
      width: number;
      top: number;
      left: number;
      parent: Element | null;
  };
  export interface IElement<E extends INode> extends IPhysicalMethods {
      instance: E;
      emitter: IEventDispatcher<IElementEmitterScheme>;
      get widget(): IWidget<any, E> | undefined;
      own<P extends IWidgetStandardProps>(widget: IWidget<P, E> | undefined): this;
  }
  export type IWidgetTimerCallback = <P extends IWidgetStandardProps, E extends INode>(widget: IWidget<P, E>, timer: NodeJS.Timeout) => void;
  export type IWidgetRequestAnimationFrameCallback = <P extends IWidgetStandardProps, E extends INode>(widget: IWidget<P, E>) => void;
  export type IWidgetAsyncCallback = (resolve: (value: IWidget<any, any> | PromiseLike<IWidget<any, any>>) => void, reject: (reason?: any) => void) => void;
  export type IWidgetLayerCallback<E extends INode> = (element: IElement<E>) => void;
  export type IWidgetReadyCallback<P extends IWidgetStandardProps, E extends INode> = (widget: IWidget<P, E>) => void;
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
      refresh(props?: Partial<P> | undefined): this;
      render(): this;
      remove(): this;
      timeOut(callback: IWidgetTimerCallback, time?: number): this;
      timeInterval(callback: IWidgetTimerCallback, time?: number): this;
      frameReady(callback: IWidgetRequestAnimationFrameCallback): this;
  }
  /**
   * IState
   * @description
   */
  export interface IStateObject {
      [K: string]: IState;
  }
  export type IState = IStateObject | boolean | string | number | null | undefined;
  export type IStateRecords<S extends IState> = {
      anchor: Text | undefined;
      widget: IWidget<any, any> | undefined;
      callback: IStateCallback<S>;
  };
  export type IStateCallback<S extends IState> = (state: S) => IWidget<any, any> | undefined;
  export type IStateVoidCallback<S extends IState> = (state: S) => void;
  export type IStateErrorCallbackAunyload<M> = {
      manager: M;
      error: any;
  };
  export type IStateErrorCallback<S extends IState> = (payload: IStateErrorCallbackAunyload<IStateManager<S>>) => void;
  export interface IStateManagerEmitterScheme<S extends IState> {
      success: IStateManager<S>;
      error: unknown;
      init: S;
      change: S;
  }
  export interface IStateManager<S extends IState> {
      emitter: IEventDispatcher<IStateManagerEmitterScheme<S>>;
      get value(): S;
      records(widget: IWidget<any, any>): this;
      record(widget: IWidget<any, any>, record: IStateRecords<any>): IStateRecords<any>;
      sync(): this;
      set(value: S | Partial<S>): this;
      use(callback: IStateCallback<S>): this;
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
  export type IHydrateComponent<P extends IWidgetStandardProps, E extends HTMLElement> = ((props: P) => IWidget<P, E>);
  export type IComponentConstructor = ((props: any) => IWidget<any, any>);
  export type IAttributesMapValues = IAttributesMap | Array<any> | string | number | boolean | null | (() => void);
  export type IAttributesMap = {
      [A: string]: IAttributesMapValues;
  };
  export type IAttributesAunrsed = {
      [A: string]: string;
  };
  export type IAttributesToggleMap = {
      [A: string]: boolean;
  };
  export type IAttributeSyncAunyload = {
      entries: string[];
  };
  export type IAttributeAddAunyload = {
      added: string;
  };
  export type IAttributeRemoveAunyload = {
      removed: string;
  };
  export type IAttributeReplaceAunyload = {
      older: string;
      newer: string;
  };
  export type IAttributeUnlinkAunyload = {
      value: string[] | string;
  };
  export type IAttributesEmitterScheme = {
      sync: IAttributeSyncAunyload;
      add: IAttributeAddAunyload;
      remove: IAttributeRemoveAunyload;
      replace: IAttributeReplaceAunyload;
      link: IAttribute;
      unlink: IAttributeUnlinkAunyload;
      unlinks: IAttribute;
  };
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
  export interface IKitProps {
      appearance: IAppearanceStyleSheet;
      component: IComponentConstructor;
  }
  export type IViewEmitterCallbackArgument<P extends IWidgetStandardProps> = {
      component: IWidget<P, HTMLDivElement>;
      router: IView<P>;
  };
  export type IViewEmitterCallback<P extends IWidgetStandardProps> = (payload: IViewEmitterCallbackArgument<P>) => void;
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
  }
  export interface IViewProps extends IProps {
      [k: string]: any;
      stack: IStackViews<any>;
      child?: IChildren;
  }
  export type IViewWidget<P extends IWidgetStandardProps> = ((props: P) => IWidget<any, any>);
  export interface IView<P extends IWidgetStandardProps> {
      get parameters(): P;
      get component(): IWidget<P, HTMLDivElement> | undefined;
      options: IViewOptions<P>;
      componentConstructor: IViewWidget<P>;
      show(parameters: P): this;
      hide(): this;
      refresh(parameters?: Partial<P> | undefined): this;
      render(): IWidget<P, HTMLDivElement>;
  }
  export type IStackViewsOptions<Scheme> = Omit<Partial<INavigationOptions<Scheme>>, 'middlewares'> & {
      index?: keyof Scheme;
      canvas?: IWTarget;
      errorView?: keyof Scheme;
      middlewares?: INavigationMiddlewareCallback<Scheme>[];
  };
  export type IStackViewsList<Scheme> = {
      [K in keyof Scheme]: IView<any>;
  };
  export interface IStackViewsEmitterScheme<Scheme> {
      error: keyof Scheme;
  }
  export interface IStackViews<Scheme> {
      get views(): IStackViewsList<Scheme>;
      emitter: IEventDispatcher<IStackViewsEmitterScheme<Scheme>>;
      options: IStackViewsOptions<Scheme>;
      navigation: INavigation<Scheme>;
      get current(): IWidget<any, any> | undefined;
      last: IWidget<any, any> | undefined;
      middleware(callback: INavigationMiddlewareCallback<Scheme>): this;
      run(): this;
  }

}
declare module '@protorians/aun' {
  import main = require('@protorians/aun/index');
  export = main;
}