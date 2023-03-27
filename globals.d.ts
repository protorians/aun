declare module '@protorians/aun/example.main' {
  export {};

}
declare module '@protorians/aun/exceptions' {
  import { IWidgerErrorException } from "@protorians/aun/types";
  export class WidgetErrorException extends Error implements IWidgerErrorException {
      message: string;
      constructor(message: string);
      messageToString(data: string): string;
  }

}
declare module '@protorians/aun/foundations' {
  import type { IAppearance, IAppearanceEmitterScheme, IAppearanceObject, IAppearanceObjectDestroyed, IAppearanceStyleSheet, IAppearanceValues, IAttribute, IAttributesEmitterScheme, IAttributesMap, IChildren, IComponentConstructor, IConstruct, IConstructEmitterScheme, IElement, IElementClassName, IElementCSS, IElementCSSRemoves, IElementEmitterScheme, IElementEventCallback, IElementMeasureCallback, IElementOffsetCallback, IEmitter, IEmitterCallback, IEmitterEntries, IEmitterProgations, IEmitterScheme, IFindElementCallback, INavigation, INavigationEmitterScheme, INavigationMiddlewareCallback, INavigationOptions, INode, IStackViews, IStackViewsEmitterScheme, IStackViewsList, IStackViewsOptions, IState, IStateCallback, IStateErrorCallback, IStateManager, IStateManagerEmitterScheme, IStateRecords, IAnimate, IAnimateCallback, IAnimateTarget, IView, IViewOptions, IWidget, IWidgetEmitterScheme, IWidgetLayerCallback, IWidgetReadyCallback, IWidgetRequestAnimationFrameCallback, IWidgetTimerCallback, IWProps, IWTarget, IWTargetNode, ITransition, ITransitionProps, IAnimateOptions, IAnimateEmitterScheme, IAnimateInterpolarities, IAnimateElementOptions, ITransitionDoneCallback } from "@protorians/aun/types";
  /**
   * fe — Find Element
   * @param find Recherché
   * @param callback Fonction de rappel contenant l'element html en argument
   */
  export function fe(find: IWTarget | undefined, callback?: IFindElementCallback): IWTargetNode | undefined;
  /**
   * Protorian EventDispatcher — Emetteur d'émission
   * @description Gestionnaire d'évènements
   * @example new AunEmitter<EmitScheme>()
   */
  export default class AunEmitter<Scheme extends IEmitterScheme> implements IEmitter<Scheme> {
      /**
       * Gestion de la propagation
       */
      propagations: IEmitterProgations<Scheme>;
      /**
       * Stockage des émissions
       */
      entries: IEmitterEntries<Scheme>;
      /**
       * Ecouter une émission de l'émetteur
       * @description Ecouteur d'évèvements par rapport à un "SLUG". Utiliser un retour "TRUE" pour stopper la propagation de l'instance déclenchée
       * @param type Type d'émission déclaré dans le `Scheme` de l'instanciation
       * @param callback Fonction de rappel content en `argument[0]` les données définit par le dispatcher
       * @example emitter.listen<ReturnType>( 'emitterNameInKeyOfScheme', ( data : ReturnType ) => ... )
       */
      listen<I extends keyof Scheme>(type: I, callback: IEmitterCallback<Scheme[I]>, force?: boolean | undefined): this;
      /**
       * Déclencheur un type d'émission de l'émetteur
       * @description Déclencheur les écouteurs par rapport au `type`
       * @param type Type d'émission déclaré dans le `Scheme` de l'instanciation
       * @param data Donnée à renvoyer aux écouteurs d'émission de l'émeteur
       * @example emitter.dispatch( 'emitterNameInKeyOfScheme', ... )
       *
       */
      dispatch(type: keyof Scheme, data: any): this;
  }
  /**
   * Protorian Element
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
      emitter: AunEmitter<IElementEmitterScheme>;
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
      own<P extends IWProps>(widget: IWidget<P, E>): this;
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
       * @param children Enfant à ajouter
       * @example
       * element.content( undefined ) // Retourne les enfants du widget propriétaire
       * element.content( 'string' )
       * element.content( widget )
       * element.content( [ widget1, widget2, ... ] )
       */
      content(children?: IChildren | IChildren[] | undefined): string | number | boolean | HTMLElement | IStateManager<IState> | IWidget<any, any> | Promise<IWidget<any, any>> | IChildren[] | this | undefined;
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
      listen<L extends keyof IElementEmitterScheme>(type: L, callback: IEmitterCallback<IElementEmitterScheme[L]>): this;
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
      toggle(tokens: IElementClassName): this;
      /**
       * className
       * @description Associé un selecteur CSS
       * @param tokens Selecteur CSS
       */
      className(tokens: IElementClassName | undefined): string[] | this;
      /**
       * removeClassName
       * @description Supprimer un selecteur CSS
       * @param tokens Selecteur CSS
       */
      removeClassName(tokens: IElementClassName): this;
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
   * AunrseAppearanceProps
   * @description Analyse la propriété de l'apparence et la réecrit
   * @param name Nom de la propriété
   * @param value Valeur de la propriété
   * @example
   * AunrseAppearanceProps<IAppearanceObject>( { color : '#777' } )
   */
  export function AunrseAppearanceProps<T extends IAppearanceObject | IAppearanceObjectDestroyed>(name: keyof IAppearanceObject, value: IAppearanceValues): T;
  /**
   * AunrseAppearanceValues
   * @description Analyse la valeur d'une propriété de l'apparence
   * @param value Valeur de la propriété
   * @example
   * AunrseAppearanceValues( ... )
   */
  export function AunrseAppearanceValues(value: IAppearanceValues): string | undefined;
  /**
   * Protorian Appearance
   * @description Gestionnaire d'apparence des éléments Protorian
   */
  export class AunAppearance implements IAppearance {
      /**
       * Instance du DOM
       */
      instance: HTMLStyleElement;
      /**
       * Signature de l'apparence
       */
      uid: string;
      /**
       * Instance de l'emetteur
       */
      emitter: AunEmitter<IAppearanceEmitterScheme>;
      /**
       * Propriétés de l'apparence
       */
      properties: IAppearanceObject;
      constructor();
      /**
       * sheet
       * C@description onstruire une feuille de style liée à l'apparence
       * @param stylesheet Definit la feuille de style
       * @example
       * appearance.sheet( {
       *    'selector' : {
       *       'property' : 'value',
       *        ...
       *    }
       * } )
       */
      sheet(stylesheet: IAppearanceStyleSheet): this;
      /**
       * insertProperties
       * @description Insert des propriétés d'apparence dans un objet support. Analyse les propriétés et les valeurs avant de les insérer
       * @param properties Propriétés d'apparence support
       * @param data Données des propriétés à insérer
       * @example
       * appearance.insertProperties( objectPropertiesSupport, objectDataToInsert )
       */
      insertProperties(properties: IAppearanceObject, data: IAppearanceObject): IAppearanceObject;
      /**
       * removeProperties
       * @description Supprime des propriétés d'apparence dans un object support.
       * @param properties Propriétés d'apparence support
       * @param payload Données des propriétés à supprimer
       * @example
       * appearance.removeProperties( objectPropertiesSupport, objectDataToRemove )
       */
      removeProperties(properties: IAppearanceObject, payload: IAppearanceObjectDestroyed): IAppearanceObject;
      /**
       * set
       * @description Insert des propriétés d'apparence. Analyse les propriétés et les valeurs avant de les insérer
       * @param properties Propriétés à insérer
       * @example
       * appearance.set( {
       *    'property' : 'value',
       *    ...
       * } )
       */
      set(properties: IAppearanceObject): this;
      /**
       * unset
       * @description Supprime des propriétés d'apparence. Analyse les propriétés et les valeurs avant.
       * @param properties Propriétés à supprimer
       * @example
       * appearance.unset( {
       *    'property' : 'value',
       *    ...
       * } )
       */
      unset(properties: IAppearanceObjectDestroyed): this;
      /**
       * mount
       * @description Monter l'apparence si ce n'est pas fait
       * @example
       * appearance.mount()
       */
      mount(): this;
      /**
       * mountImmediat
       * @description Monter l'apparence
       * @example
       * appearance.mountImmediat()
       */
      mountImmediat(): this;
      /**
       * destroy
       * @description Détruit l'apparence
       * @example
       * appearance.destroy()
       */
      destroy(): this;
      /**
       * sync
       * @description Synchronise l'apparence
       * @example
       * appearance.sync()
       */
      sync(): this;
  }
  /**
   * Protorian Attribute
   * @description Gestionnaire d'attribute dynamique
   */
  export class AunAttribute implements IAttribute {
      #private;
      /**
       * Nom de lattribut
       */
      attributeName: string;
      /**
       * Emetteur
       */
      emitter: AunEmitter<IAttributesEmitterScheme>;
      /**
       * Les entrées
       */
      get entries(): string[];
      /**
       * La valeur de l'attribut
       */
      get value(): string;
      constructor(element: HTMLElement | null, attributeName?: string);
      /**
       * sync
       * @description Synchronise les attributs
       * @param attributeName Nom de l'attribut
       * @description
       * attribut.sync()
       */
      sync(attributeName?: string): this;
      /**
       * add
       * @description Ajout une entrée à l'attribut
       * @param value Valeur de l'attribut
       * @example
       * attribut.add( ... )
       */
      add(value: string): this;
      /**
       * remove
       * @description Supprimer une entrée de l'attribut
       * @param value Valeur de l'attribut
       * @example
       * attribut.remove( ... )
       */
      remove(value: string): this;
      /**
       * replace
       * @description Remplace le valeur dans un attribut
       * @param older Ancienne valeur de l'attribut
       * @param value Nouvelle valeur de l'attribut
       * @example
       * attribut.replace( 'oldValue', 'newValue' )
       */
      replace(older: string, value: string): this;
      /**
       * contains
       * @description Recherche l'existence d'une valeur dans l'instance de l'attribut
       * @param value Valeur dans l'attribut recherché
       * @example
       * attribut.contains( 'searchValue' )
       */
      contains(value: string): boolean;
      /**
       * link
       * @description Lie un attribut à une instance du DOM
       * @example
       * attribut.link()
       */
      link(): this;
      /**
       * unlink
       * @description Supprime la liaison d'un attribut dans  l'instance
       * @param attributes Nom de l'attribut
       * @example
       * attribut.unlink( 'attributName' )
       */
      unlink(attributes?: string | string[]): this;
  }
  /**
   * Protorian State
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
      emitter: AunEmitter<IStateManagerEmitterScheme<S>>;
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
   * Protorian Widget
   * @description Pour les composant HTML de base
   */
  export class AunWidget<P extends IWProps, E extends INode> implements IWidget<P, E> {
      #private;
      /**
       * Instance de l'élément
       */
      element: IElement<E>;
      /**
       * Enfant du widget
       */
      children?: IChildren | IChildren[] | undefined;
      /**
       * Les propriétés
       */
      get props(): P;
      /**
       * Emetteur
       */
      emitter: AunEmitter<IWidgetEmitterScheme<P, E>>;
      /**
       * Constructe
       */
      construct: IConstruct<P, E>;
      constructor(tagname: string, props: P);
      append(...nodes: Array<string | Node>): this;
      ready(callback: IWidgetReadyCallback<P, E>): this;
      layer(callback: IWidgetLayerCallback<E>): this;
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
       * @param children Contenu du widget
       * @example
       * widget.content( ... )
       */
      content(children?: IChildren | IChildren[] | undefined): this | IChildren;
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
   * Protorian Construct
   * @description Constructeur de Widget
   */
  export class AunConstruct<P extends IWProps, E extends INode> implements IConstruct<P, E> {
      /**
       * Emetteur
       */
      emitter: AunEmitter<IConstructEmitterScheme<P, E>>;
      /**
       * Apparence
       */
      appearance: IAppearance;
      constructor();
      /**
       * make
       * @description Créer le constructeur
       * @param root Racine Widget
       * @param children Enfants à ajouter
       */
      make(root: IWidget<P, E>, children: IChildren): IWidget<P, E>;
      /**
       * makeChildren
       * @description Construire les enfants
       * @param root Racine Widget
       * @param children Enfants à ajouter
       */
      makeChildren(root: IWidget<P, E>, children: IChildren): IWidget<P, E>;
      /**
       * makeAppearance
       * @description Construire l'apparence
       * @param root
       * @param payload
       */
      makeAppearance(root: IWidget<P, E>, payload: IAppearanceObject): IWidget<P, E>;
  }
  export class AunView<ComponentProps extends IWProps> implements IView<ComponentProps> {
      #private;
      get parameters(): ComponentProps;
      get component(): IWidget<ComponentProps, HTMLDivElement> | undefined;
      componentConstructor: IComponentConstructor;
      options: IViewOptions<ComponentProps>;
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
      oldComponent: IWidget<any, any> | undefined;
      /**
       * Options
       */
      options: IStackViewsOptions<Scheme>;
      /**
       * Système de navigation
       */
      navigation: INavigation<Scheme>;
      emitter: IEmitter<IStackViewsEmitterScheme<Scheme>>;
      constructor(views: IStackViewsList<Scheme>, options: IStackViewsOptions<Scheme>);
      middleware(callback: INavigationMiddlewareCallback<Scheme>): this;
      currentView(): IStackViewsList<Scheme>[keyof Scheme] | undefined;
      oldView(): IStackViewsList<Scheme>[keyof Scheme] | undefined;
      /**
       * Démarrage
       */
      run(): this;
  }
  /**
   * Système de navigation
   */
  export class AunNavigation<Scheme> implements INavigation<Scheme> {
      #private;
      options: INavigationOptions<Scheme>;
      emitter: IEmitter<INavigationEmitterScheme<Scheme>>;
      constructor();
      currentRouteName(): keyof Scheme;
      oldRouteName(): keyof Scheme | undefined;
      currentQuery<T>(): T | undefined;
      setOption(optionName: keyof INavigationOptions<Scheme>, value: (INavigationMiddlewareCallback<Scheme>[] & boolean) | undefined): this;
      setOptions(options: INavigationOptions<Scheme>): this;
      middleware(middleware: INavigationMiddlewareCallback<Scheme>): this;
      observe(): this;
      capturesActions(): this;
      parseRouteName(routeName: string): string;
      isExternalURL(url: string): boolean;
      parseElementCaptured(ev: Event): HTMLElement | undefined;
      dispatchNavigate(ev?: Event | undefined): this;
      navigate(route: keyof Scheme, props?: (Scheme[keyof Scheme]), ev?: Event): this;
  }
  /**
   * Transition des éléments
   */
  export class AUNTransition implements ITransition {
      #private;
      constructor(props: ITransitionProps);
      in(target: IAnimateTarget, doneCallback: ITransitionDoneCallback): IAnimate;
      out(target: IAnimateTarget, doneCallback: ITransitionDoneCallback): IAnimate;
  }
  /**
   * Transitions prédinies des éléments
   */
  export class AUNTransitions {
      static fade: AUNTransition;
      static horizontalSlide: AUNTransition;
  }
  /**
   * Animation des éléments
   */
  export class AUNAnimate implements IAnimate {
      #private;
      options: IAnimateOptions;
      get defaultFrame(): number;
      interpolarities: IAnimateInterpolarities;
      state: number;
      loopState: number;
      status: boolean;
      emitter: IEmitter<IAnimateEmitterScheme>;
      constructor(target: IAnimateTarget, callback: IAnimateCallback);
      clean(): this;
      /**
       * Anime un élément
       */
      element(options: IAnimateElementOptions): this;
      /**
       * Remake the animation with new options
       */
      reset(options: IAnimateOptions): this;
      create(options: IAnimateOptions): this;
      /**
       * Stopper
       */
      stop(): this;
      /**
       * Redemarrage de l'animation
       */
      restart(): this;
      /**
       * Lecture de l'animation
       */
      play(): this;
      static trigger(target: IAnimateTarget, callback: IAnimateCallback): AUNAnimate;
  }
  /**
   * Animations des éléments
   */
  /**
   * Système de changement de vue
   */

}
declare module '@protorians/aun/index' {
  import { AunElement, AunState, AunWidget, AunView, AunStackViews } from "@protorians/aun/foundations";
  import { IChildren, IComponentConstructor, IHydrateComponent, IKitProps, INode, IStackViewsList, IStackViewsOptions, IState, IViewOptions, IWidget, IWidgetAsyncCallback, IWProps, IWTarget } from "@protorians/aun/types";
  /**
   * CreateState
   * @description Instance fonctionnelle d'usage de gestion des états Protorian
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
  export function DropComponent<P extends IWProps, E extends INode>(component: IWidget<P, E>, target: INode): IWidget<P, E>;
  /**
   * DropComponents
   * @description Lier plusieurs composants à plusieurs cicles.
   * @param targets Balises HTML cible où deposer le composant. La valeur peut être un Element HTML ou une requete de selecteur. Instancie plusieurs cicle à la fois.
   * @param component Composant à deposer dans l'élément HTML
   * @example DropComponents<PropsType, HTMLDivElement>( '.drop-target', ( props : Props ) => ... )
   */
  export function DropComponents<P extends IWProps, E extends INode>(component: IWidget<P, E>, targets: NodeListOf<INode>): IWidget<P, E>;
  /**
   * InstantiateComponent
   * @description Instancier un composant. Cela permet de garder l'instance courante du composant avec les propriétés définies. À utiliser dans les cas l'IDE n'arrive pas typer correctement les variables.
   * @param component Composant cible
   * @example InstantiateComponent( component( props ) )
   */
  export function InstantiateComponent(component: IWidget<any, any>): IWidget<any, any>;
  /**
   * AsyncComponent
   * @description Utiliser un composant avec une promesse. Composant bloquant en attendant le traitement. Il peut être ajouter aux enfants d'un widget
   * @param callback Fonction de renvoie pour le traitement d'un promesse. Puis renvoyer un composant instancié
   * @example AsyncComponent( ( resolve, reject ) => {
   *    setTimeout( () => resolve( component() ), 3000 )
   * })
   */
  export function AsyncComponent<P extends IWProps, E extends INode>(callback: IWidgetAsyncCallback): Promise<IWidget<P, E>>;
  /**
   * UseComponent
   * @description Utiliser un composant dans une / plusieurs cibles
   * @param target Balises HTML cible où deposer le composant. La valeur peut être un Element HTML ou une requete de selecteur. Instancie plusieurs cicle à la fois.
   * @param component Composant instancié
   * @example UseComponent<PropsType>( '#root', component( props ) ) // Requête de selecteur pour la cible
   * UseComponent<PropsType>( document.getElementById('root'), component( props ) ) // Instance de type HTMLElement pour la cible
   */
  export function UseComponent<P extends IWProps, E extends INode>(component: IWidget<any, any>, target: IWTarget): IWidget<P, E>;
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
  export function CreateKit(definition: IKitProps): <P extends IWProps, E extends HTMLElement>(p: P) => IWidget<P, E>;
  /**
   * aun — Protorian Virtual Element
   * @description Instance fonctionnelle d'usage des éléments Protorian
   * @param tagname Nom de la balise HTML
   * @example aun<HTMLSpanElement>( 'span' )
   */
  export function aune<E extends INode>(tagname: string): AunElement<E>;
  /**
   * VWidget
   * @description Instance fonctionnelle d'usage des Widgets Protorian
   * @param tagname Nom de la balise HTML
   * @param props Propriétés du widget
   * @example VWidget<PropsType, HTMLSpanElement>( 'span', props )
   */
  export function VWidget<P extends IWProps, E extends INode>(tagname: string, props: P): AunWidget<P, E>;
  /**
   * Widget
   * @description Créer une couche de calque
   * @param props Propriétés du widget. La propriété `children` représente les enfants du widget (contenu)
   * @example Widget<PropsType>({
   * children: ...
   * otherProp: ...
   * })
   */
  export function Widget<P extends IWProps>(props: P): AunWidget<P, HTMLDivElement>;
  /**
   * Textual
   * @description Calque destiné aux textes
   * @param props Propriétés du widget. La propriété `children` représente les enfants du widget (contenu)
   * @example Textual<PropsType>({
   * children: ...
   * otherProp: ...
   * })
   */
  export function TextWidget<P extends IWProps>(props: P): AunWidget<P, HTMLSpanElement>;
  export function View<C extends IWProps>(component: IComponentConstructor, options?: IViewOptions<C> | undefined): AunView<C>;
  export function CreateStackViews<Scheme>(views: IStackViewsList<Scheme>, options?: IStackViewsOptions<Scheme>): AunStackViews<Scheme>;
  /**
   * Protorian Construct
   * @description Construire un composant à partir des enfants
   * @param component Composant cible
   * @param children Enfant à injecter
   * @example Construct<ComponentType>( component, children )
   * Construct( component, children )
   */
  export function Construct<Component extends IWidget<IWProps, INode>>(component: Component, children: IChildren): IWidget<IWProps, HTMLElement>;
  /**
   * CreateComponent
   * @description Créer un composant en ajoutant immédiatement à la fil d'attente hydratation tout en permetant de l'exporter avec un nom d'emprunt.
   * @param name
   * @param widgetConstructor
   * @example export const HelloWord = CreateComponent<PropType>('HelloWorld', ( props : IWProps ) => ... )
   */
  export function CreateComponent<P extends IWProps>(name: string, widgetConstructor: IHydrateComponent<any, HTMLElement>): IHydrateComponent<P, HTMLElement>;
  /**
   * HydrateComponentQueue
   * @description Fil d'attente des hydration des composants Protorian
   * @param name CNom du composant. Sensible à la case
   * @param widgetConstructor Constructeur du composant Protorian
   * @example HydrateComponentQueue<WidgetPropsType>( 'ComponentName', ( props : WidgetProps ) => ... )
   */
  export function HydrateComponentQueue<P extends IWProps>(name: string, widgetConstructor: IHydrateComponent<any, HTMLElement>): IHydrateComponent<any, HTMLElement>;
  /**
   * HydrateComponent
   * @param name Chaine de caratère représentant le nom du composant. Sensible à la case
   * @param widgetConstructor Constructeur du composant Protorian
   * @example HydrateComponent<PropsType>( 'Hello', HelloComponent )
   */
  export function HydrateComponent<P extends IWProps>(name: string, widgetConstructor: IHydrateComponent<any, HTMLElement>): IHydrateComponent<any, HTMLElement>;
  /**
   * ExtractProps
   * @description Extraction des propriétés dans le constructeur d'un composant
   * @param attributes Contenu de la propriété "HTMLElement.attributes"
   * @example ExtractProps<PropsType>( element.attributes )
   */
  export function ExtractProps<P extends IWProps>(attributes: NamedNodeMap): P;
  /**
   * ActiveAutoHydrateComponents
   * @description Active l'hydratation automatique des composants
   * @example ActiveAutoHydrateComponents()
   */
  export function ActiveAutoHydrateComponents(): MutationObserver;
  /**
   * Protorian
   * @description Exportations des fonctionnalités de base du framework
   */
  export default class Protorian {
      /**
       * aun — Protorian Virtual Element
       * @description Instance fonctionnelle d'usage des éléments Protorian
       */
      static VirtualElement: typeof aune;
      /**
       * VWidget
       * @description Instance fonctionnelle d'usage des Widgets Protorian
       */
      static VWidget: typeof VWidget;
      /**
       * Construct
       * @description Construire un composant via AunConstruct
       */
      static Construct: typeof Construct;
      /**
       * Widget
       * @description Créer une couche de calque
       */
      static Widget: typeof Widget;
      /**
       * Textual
       * @description Calque destiné aux textes
       */
      static Textual: typeof TextWidget;
      /**
       * CreateState
       * @description Instance fonctionnelle d'usage de gestion des états Protorian
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
       * InstantiateComponent
       * @description Instancier un composant. Cela permet de garder l'instance courante du composant avec les propriétés définies
       */
      static InstantiateComponent: typeof InstantiateComponent;
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
declare module '@protorians/aun/metric' {
  export class MetricRandom {
      static ALPHA_NUMERIC: string;
      static ALPHA_NUMERIC_LOWER: string;
      static ALPHA_NUMERIC_UPPER: string;
      static ALPHA_UPPER: string;
      static ALPHA_LOWER: string;
      static HEX_UPPER: string;
      static HEX_LOWER: string;
      static NUMERIC: string;
      static CreateRandom(min: number, max: number): number;
      static CreateBlock(base: string, length: number): string[];
      static CreateAplpha(length: number): string[];
      static CreateHEX(length: number): string[];
      static CreateNumeric(length: number): string[];
      static Create(length: number): string[];
  }

}
declare module '@protorians/aun/types' {
  /// <reference types="node" />
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
  };
  export type IChild = string | number | boolean | IStateManager<IState> | IWidget<any, any> | HTMLElement | undefined;
  export type IChildren = IChild | Promise<IWidget<any, any>> | Array<IChild | Promise<IWidget<any, any>>> | IChildren[];
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
  /**
   * IProps
   * @description définition des propriétés de base
   */
  export interface IProps {
      [P: string]: any;
  }
  /**
   * IWProps extends IProps
   * @description Les propriétés d'un widget. Les propriétés iront en attributs html avec le prefix "prop:{KEY}" pour garder la persistence. Les données de type objet seront convetir en JSON
   */
  export interface IWProps extends IProps {
      children?: IChildren;
  }
  export type IEmitterCallback<I> = (payload: I) => void | boolean;
  export type IEmitterEntry = {
      force?: boolean;
      callback: IEmitterCallback<any>;
  };
  export type IEmitterEntries<Scheme extends IEmitterScheme> = {
      [K in keyof Scheme]: IEmitterEntry[];
  };
  export type IEmitterProgations<Scheme extends IEmitterScheme> = {
      [K in keyof Scheme]: boolean;
  };
  export interface IEmitterScheme {
      [K: string]: any;
  }
  export interface IPhysicalMethods {
      asyncMeasure(): DOMRect;
      measure(callback: IElementMeasureCallback): this;
      clean(): this;
      remove(): this;
      asyncOffset(): IElementOffset;
      offset(callback: IElementOffsetCallback): this;
      content(children?: IChildren | undefined): this | IChildren;
      html(data?: string | undefined): this | string;
      append(...nodes: (string | Node)[]): this;
      listen<L extends keyof IElementEmitterScheme>(type: L, callback: IEmitterCallback<IElementEmitterScheme[L]>): this;
      on<T extends keyof HTMLElementEventMap>(type: T, callback: IElementEventCallback<T>, options?: AddEventListenerOptions | boolean | undefined): this;
      style(tokens: IElementCSS | undefined): this;
      removeStyle(tokens: IElementCSSRemoves): this;
      toggle(tokens: IElementClassName): this;
      className(tokens: IElementClassName | undefined): this | string[];
      removeClassName(tokens: IElementClassName): this;
      attribute(tokens?: IAttributesMap | undefined, ns?: string | undefined, separator?: string | undefined): this;
      attributeNS(tokens?: IAttributesMap | undefined, ns?: string | undefined): this;
      removeAttribute(tokens: IAttributesMap, ns?: string | undefined, separator?: string | undefined): this;
      toggleAttribute(tokens: IAttributesMap, ns?: string | undefined, separator?: string | undefined): this;
  }
  export interface IEmitter<Scheme extends IEmitterScheme> {
      propagations: IEmitterProgations<Scheme>;
      entries: IEmitterEntries<Scheme>;
      listen<I extends keyof Scheme>(type: I, callback: IEmitterCallback<Scheme[I]>, force?: boolean): this;
      dispatch(type: keyof Scheme, data?: any): this;
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
      emitter: IEmitter<IElementEmitterScheme>;
      get widget(): IWidget<any, E> | undefined;
      own<P extends IWProps>(widget: IWidget<P, E> | undefined): this;
  }
  export type IWidgetTimerCallback = <P extends IWProps, E extends INode>(widget: IWidget<P, E>, timer: NodeJS.Timeout) => void;
  export type IWidgetRequestAnimationFrameCallback = <P extends IWProps, E extends INode>(widget: IWidget<P, E>) => void;
  export type IWidgetAsyncCallback = (resolve: (value: IWidget<any, any> | PromiseLike<IWidget<any, any>>) => void, reject: (reason?: any) => void) => void;
  export type IWidgetLayerCallback<E extends INode> = (element: IElement<E>) => void;
  export type IWidgetReadyCallback<P extends IWProps, E extends INode> = (widget: IWidget<P, E>) => void;
  export interface IWidgetEmitterScheme<P extends IWProps, E extends INode> {
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
  export interface IWidget<P extends IWProps, E extends INode> {
      element: IElement<E>;
      children?: IChildren | IChildren[] | undefined;
      get props(): P;
      emitter: IEmitter<IWidgetEmitterScheme<P, E>>;
      construct: IConstruct<P, E>;
      ready(callback: IWidgetReadyCallback<P, E>): this;
      layer(callback: IWidgetLayerCallback<E>): this;
      appear(payload: IAppearanceObject): this;
      content(children?: IChildren | undefined): this | IChildren;
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
  export type IStateCallback<S extends IState> = (state: S) => IWidget<any, any>;
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
      emitter: IEmitter<IStateManagerEmitterScheme<S>>;
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
  export interface IConstructEmitterScheme<P extends IWProps, E extends INode> {
      before: IWidget<P, E>;
      after: IWidget<P, E>;
      appearance: IAppearance;
  }
  export interface IConstruct<P extends IWProps, E extends INode> {
      emitter: IEmitter<IConstructEmitterScheme<P, E>>;
      appearance: IAppearance;
      make(root: IWidget<P, E>, children: IChildren | IChildren[]): IWidget<P, E>;
      makeChildren(root: IWidget<P, E>, children: IChildren): IWidget<P, E>;
      makeAppearance(root: IWidget<P, E>, payload: IAppearanceObject): IWidget<P, E>;
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
  export type IAppearanceValues = string | number | undefined;
  export interface IAppearanceCSSDeclaration extends Partial<CSSStyleDeclaration> {
      paddingVertical?: IAppearanceValues;
      paddingHorizontal?: IAppearanceValues;
      marginVertical?: IAppearanceValues;
      marginHorizontal?: IAppearanceValues;
  }
  export type IAppearanceObject = {
      [K in keyof Partial<IAppearanceCSSDeclaration>]: IAppearanceValues;
  };
  export interface IAppearanceStyleSheet {
      [Selector: string]: IAppearanceObject;
  }
  export type IAppearanceObjectDestroyed = Array<keyof IAppearanceObject>;
  export interface IAppearance {
      instance: HTMLStyleElement;
      uid: string;
      properties: IAppearanceObject;
      emitter: IEmitter<IAppearanceEmitterScheme>;
      insertProperties(properties: IAppearanceObject, data: IAppearanceObject): IAppearanceObject;
      removeProperties(properties: IAppearanceObject, payload: IAppearanceObjectDestroyed): IAppearanceObject;
      sheet(stylesheet: IAppearanceStyleSheet): this;
      set(payload: IAppearanceObject): this;
      unset(payload: IAppearanceObjectDestroyed): this;
      mount(): this;
      mountImmediat(): this;
      sync(): this;
      destroy(): this;
  }
  export type IHydrateComponent<P extends IWProps, E extends HTMLElement> = ((props: P) => IWidget<P, E>);
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
  export type IViewEmitterCallbackArgument<C extends IWProps> = {
      component: IWidget<C, HTMLDivElement>;
      router: IView<C>;
  };
  export type IViewEmitterCallback<C extends IWProps> = (payload: IViewEmitterCallbackArgument<C>) => void;
  export interface IViewEmitters<C extends IWProps> {
      show?: IViewEmitterCallback<C>;
      hide?: IViewEmitterCallback<C>;
  }
  export interface IViewOptions<C extends IWProps> {
      name: string;
      title: string;
      presenter?: 'normal' | 'modal' | 'overlay' | 'overlaySideLeft' | 'overlaySideRight';
      emitters?: IViewEmitters<C>;
      transitions?: {
          entry: ITransition;
          exit: ITransition;
      };
  }
  export interface IView<ComponentProps extends IWProps> {
      get parameters(): ComponentProps;
      get component(): IWidget<ComponentProps, HTMLDivElement> | undefined;
      options: IViewOptions<ComponentProps>;
      componentConstructor: IComponentConstructor;
      show(parameters: ComponentProps): this;
      hide(): this;
      refresh(parameters?: Partial<ComponentProps> | undefined): this;
      render(): IWidget<ComponentProps, HTMLDivElement>;
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
      emitter: IEmitter<IStackViewsEmitterScheme<Scheme>>;
      options: IStackViewsOptions<Scheme>;
      navigation: INavigation<Scheme>;
      currentView(): IStackViewsList<Scheme>[keyof Scheme] | undefined;
      middleware(callback: INavigationMiddlewareCallback<Scheme>): this;
      run(): this;
  }
  export type INavigationNavigateParser = 'hashtag' | 'directory';
  export type INavigationNavigateProps<Scheme> = {
      navigation: INavigation<Scheme>;
      routeName: keyof Scheme;
      parser: INavigationNavigateParser;
  };
  export type INavigationMiddlewareProps<Scheme> = {
      navigation: INavigation<Scheme>;
      event: Event | undefined;
      parser: INavigationNavigateParser;
      routeName: keyof Scheme;
      args: Scheme[keyof Scheme] | IWProps | undefined;
  };
  export type INavigationMiddlewareCallback<Scheme> = (payload: INavigationMiddlewareProps<Scheme>) => void;
  export type INavigationOptions<Scheme> = {
      useHashtagParser?: boolean;
      capture?: boolean;
      middlewares?: INavigationMiddlewareCallback<Scheme>[];
  };
  export interface INavigationEmitterScheme<Scheme> {
      options: INavigation<Scheme>;
      navigate: INavigationNavigateProps<Scheme>;
  }
  export interface INavigation<Scheme> {
      emitter: IEmitter<INavigationEmitterScheme<Scheme>>;
      options: INavigationOptions<Scheme>;
      setOptions(options: INavigationOptions<Scheme>): this;
      setOption(optionName: keyof INavigationOptions<Scheme>, value: (INavigationMiddlewareCallback<Scheme>[] & boolean) | undefined): this;
      middleware(middleware: INavigationMiddlewareCallback<Scheme>): this;
      dispatchNavigate(ev?: PopStateEvent | undefined): this;
      capturesActions(): this;
      isExternalURL(url: string): boolean;
      parseElementCaptured(event: Event): HTMLElement | undefined;
      currentRouteName(): keyof Scheme;
      oldRouteName(): keyof Scheme | undefined;
      currentQuery<T>(): T | undefined;
      observe(): this;
      navigate(route: keyof Scheme, props?: Scheme[keyof Scheme], ev?: PopStateEvent): this;
  }
  export type ITransitionDoneCallback = (transition: ITransition) => void;
  export type ITransitionType = 'entry' | 'exit';
  export type ITransitionProps = {
      whenEntry: (target: IAnimateTarget) => IAnimate;
      whenExit: (target: IAnimateTarget) => IAnimate;
  };
  export interface ITransition {
      in(target: IAnimateTarget, done: ITransitionDoneCallback): IAnimate;
      out(target: IAnimateTarget, done: ITransitionDoneCallback): IAnimate;
  }
  export type IAnimateInterpolarities = number[][];
  export type IAnimateInterpolarity = number[];
  export type IAnimateHitCallbackProps = {
      interpolarity: number[];
      animate: IAnimate;
      percent: number;
  };
  export type IAnimateHitCallback = (props: IAnimateHitCallbackProps) => void;
  export type IAnimateEmitterScheme = {
      ready: IAnimateInterpolarities;
      start: IAnimateInterpolarities;
      done: IAnimateInterpolarities;
      stop: IAnimate;
      loop: IAnimate;
      hit: IAnimateHitPayload;
  };
  export type IAnimateHit = {
      interpolate: number[];
      engine: IAnimate;
      percent: number;
  };
  export type IAnimateOptions = {
      from: number[];
      to: number[];
      duration: number;
      frame?: number;
      loop?: boolean | number;
      start?: (engine: IAnimate) => void;
      hit?: IAnimateHitCallback;
      done?: (engine: IAnimate) => void;
  };
  export type IAnimateElementProperties = Array<keyof CSSStyleDeclaration>;
  export type IAnimateElementPattern = ((value: number) => string) | null;
  export type IAnimateElementOptions = {
      target: IAnimateTarget;
      from?: number[];
      to?: number[];
      duration?: number;
      properties?: IAnimateElementProperties;
      patterns?: IAnimateElementPattern[];
  };
  export type IAnimateProps = {
      animates: IAnimate[];
  };
  export type IAnimateTarget = IElement<HTMLElement>;
  export type IAnimateConstructor = (target: IAnimateTarget, callback: IAnimateCallback) => IAnimate;
  export type IAnimatePayload = {
      animate: IAnimate;
      target: IElement<HTMLElement>;
  };
  export type IAnimateHitPayload = {
      interpolate: IAnimateInterpolarity;
      engine: IAnimate;
      percent: number;
  };
  export type IAnimateCallback = (payload: IAnimatePayload) => IAnimate;
  export interface IAnimate {
      options: IAnimateOptions;
      defaultFrame: number;
      interpolarities: IAnimateInterpolarities;
      state: number;
      loopState: number;
      status: boolean;
      emitter: IEmitter<IAnimateEmitterScheme>;
      clean(): this;
      reset(options: IAnimateOptions): this;
      create(options: IAnimateOptions): this;
      element(options: IAnimateElementOptions): this;
      stop(): this;
      restart(): this;
      play(): this;
  }
  export interface IAnimates {
  }

}
declare module '@protorians/aun/utilities' {
  import { IAttributesMap, IAttributesMapValues, IObjectToString } from "@protorians/aun/types";
  /**
   * URLParamsObject
   * @param searchParams Chaine de caractère des paramètres
   */
  export function URLParamsObject<T>(searchParams: string): T | undefined;
  /**
   * BrowseDOMPath
   * @description Parcour l'arbre de parent d'un element. Une fonction de validation peut stopper le parcour en retournant true. Chaque parent parcourut est renvoyer via la fonction de validation
   * @param child Element à parcourir
   * @param validator Fonction de validation
   * @example
   * BrowseDOMPath( element, ( parent ) => ... )
   */
  export function AscendingDOMPath<T extends Node | HTMLElement>(child: T, validator: (parent: T) => boolean): T | undefined;
  /**
   * UpdateObject
   * @description Mise à jour d'un objet à partir d'un autre objet
   * @param originalObject Object original
   * @param parameters À injecter
   */
  export function UpdateObject<T>(originalObject: T, parameters?: Partial<T> | undefined): T;
  /**
   * AttributesValuesAunrser
   * @description Analyse et donne la valeur en fonction du type
   * @param value Valeur de l'attribute
   * @example AttributesValuesAunrser( data )
   */
  export function AttributesValuesAunrser(value: IAttributesMapValues): IAttributesMapValues;
  /**
   * AttributesObject
   * @param attributes Charge utile
   * @param ns nom de l'espace — `ui:button="success"`
   * @param separator Chaine de caratère entre le nom d'espace et le nom de l'attribut
   */
  export function AttributesObject<T extends IAttributesMap>(attributes: IAttributesMap, ns?: string | undefined, separator?: string | undefined): T;
  export function ObjectToString(payload: object, c?: IObjectToString): string;
  /**
   * SafeText
   * @description Désactiver les crochets et quotes dans du texte
   */
  export function safeText(text: string): string;
  /**
   * SafeText
   * @description Activer les crochets et quotes dans du texte
   */
  export function unSafeText(text: string): string;
  /**
   * addSlashes
   * @description Désactiver les crochets et quotes dans du texte
   */
  export function AddSlashes(text: string): string;
  /**
   * stripSlashes
   * @description Désactiver les crochets et quotes dans du texte
   */
  export function StripSlashes(text: string): string;
  /**
   * uncamelize
   */
  export function UnCamelize(value: string): string;
  /**
   * camelize
   */
  export function Camelize(value: string): string;

}
declare module '@protorians/aun' {
  import main = require('@protorians/aun/index');
  export = main;
}