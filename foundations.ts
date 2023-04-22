
import EventDispatcher from "@protorians/core/event-dispatcher";
import type {
  IAttributesMap,
  IAttributesToggleMap,
  IChildren,
  IComponentConstructor,
  IConstruct,
  IConstructEmitterScheme,
  IElement,
  IElementClassName,
  IElementCSS,
  IElementCSSRemoves,
  IElementEmitterScheme,
  IElementEventCallback,
  IElementMeasureCallback,
  IElementOffsetCallback,
  IFindElementCallback,
  INode,
  IStackViews,
  IStackViewsEmitterScheme,
  IStackViewsList,
  IStackViewsOptions,
  IState,
  IStateCallback,
  IStateErrorCallback,
  IStateManager,
  IStateManagerEmitterScheme,
  IStateRecords,
  IView,
  IViewOptions,
  IWidget,
  IWidgetEmitterScheme,
  IWidgetLayerCallback,
  IWidgetReadyCallback,
  IWidgetRequestAnimationFrameCallback,
  IWidgetTimerCallback,
  IWTarget,
  IWTargetNode,
  IViewProps,
  IStateVoidCallback,
  IWidgetBaseProps,
  IWidgetAttributeProps,
  IWidgetAttributeNSProps,
} from "./types";
import type {
  IAppearance,
  IAppearanceObject,
  IEventDispatcher,
  IEventDispatcherCallback,
  INavigation,
  INavigationMiddlewareCallback,
  INavigationMiddlewareProps
} from "@protorians/core/types";
import { AttributesObject, UpdateObject } from "@protorians/core/utilities";
import { Navigation } from "@protorians/core/navigation";
import CoreAppearance from "@protorians/core/appearance";



/**
 * findElement — Find Element
 * @param find Recherché
 * @param callback Fonction de rappel contenant l'element html en argument
 */
export function findElement(

  find: IWTarget | undefined,

  callback?: IFindElementCallback

): IWTargetNode | undefined {

  const fn = callback || new Function()

  let target = undefined;

  if (find) {

    if (typeof find == 'string') {

      target = document.querySelectorAll<HTMLElement>(find);

      target.forEach(element => fn(element))

    }

    else if (find instanceof NodeList) {

      target = find;

      target.forEach(element => fn(element))

    }

    else if (find instanceof HTMLElement) {

      target = find;

      fn(target)

    }

    else if (find instanceof AunElement) {

      target = find.instance;

      fn(target)

    }

  }

  return target;

}


/**
 * AUN Element
 * @description Encapscule l'lement HTML pour un usage optimal
 * @example AunElement<HTMLDivElement>('div')
 */
export class AunElement<E extends INode> implements IElement<E>{

  /**
   * Instance contenant le DOM
   */
  instance: E;

  /**
   * Emetteur
   */
  emitter = new EventDispatcher<IElementEmitterScheme>()

  /**
   * Widget associé
   */
  get widget() { return this.#widget; }

  #widget: IWidget<any, E> | undefined = undefined



  constructor(tagname: string) {

    this.instance = document.createElement(tagname) as E;

  }

  /**
   * own
   * @description Définit le widget propriétaire de l'élément
   * @param widget Widget Cible
   * @example element.own( widget )
   */
  own<P extends IWidgetBaseProps>(widget: IWidget<P, E>): this {

    this.#widget = widget;

    this.emitter.dispatch('own', widget)

    return this;

  }

  /**
   * asyncMeasure
   * @description Retrouve les dimension et le position de l'instance de l'élément en retournant les valeurs.
   * Ceci permet d'enchaine avec une autre methode
   * @example element.asyncMeasure()
   */
  asyncMeasure() {

    const data = this.instance.getBoundingClientRect();

    this.emitter.dispatch('measure', data)

    return data;

  }

  /**
   * measure
   * @description Execute asyncMeasure mais avec un callback
   * @param callback Fonction de rappel retournant la valeur en argument
   * @example element.measure( measure => ... )
   */
  measure(callback: IElementMeasureCallback) {

    callback(this.asyncMeasure())

    return this;

  }


  data(key: string, value: string): this {

    this.instance.dataset[key] = value;

    return this;

  }

  /**
   * clean
   * @description Nettoie le contenu de l'instance de l'élément
   * @example element.clean()
   */
  clean() {

    Object.values(this.instance.children).forEach(children => children.remove())

    this.emitter.dispatch('clean', undefined)

    return this;

  }

  /**
   * remove
   * @description Supprime l'élément
   * @example element.remove()
   */
  remove() {

    this.instance.remove();

    this.emitter.dispatch('remove', undefined)

    return this;

  }

  /**
   * asyncOffset
   * @description Retrouve les valeurs de l'`offset` de l'intance de l'élément en les retournant
   * @example element.asyncOffset()
   */
  asyncOffset() {

    const data = {

      height: this.instance.offsetHeight,

      width: this.instance.offsetWidth,

      top: this.instance.offsetTop,

      left: this.instance.offsetLeft,

      parent: this.instance.offsetParent,

    };

    this.emitter.dispatch('offset', data)

    return data;

  }

  /**
   * offset
   * @description Exécute `asyncOffset` mais avec une fonction de rappel. 
   * Ceci permet d'enchaine avec une autre methode
   * @param callback Fonction de rappel retournant la valeur en argument
   * @example element.offset( offset => ... )
   */
  offset(callback: IElementOffsetCallback) {

    callback(this.asyncOffset())

    return this;

  }

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
  content(child?: IChildren | IChildren[] | undefined) {

    if (typeof child != 'undefined') {

      this.widget?.construct.make(this.widget, child)

      this.emitter.dispatch('content', child)

      return this;

    }

    return this.widget?.child

  }

  /**
   * html
   * @description Définit un contenu HTML dans l'élément
   * @param data Contenu HTML
   * @example
   * element.html( 'string' )
   */
  html(data?: string | undefined) {

    if (typeof data != 'undefined') {

      this.instance.innerHTML = data

      this.emitter.dispatch('html', data)

      return this;

    }

    return this.instance.innerHTML

  }

  /**
   * append
   * @description Ajout un noeud ou une chaine de caratère à l'élément
   * @param nodes Noeud ou chaine de caratère
   * @example
   * element.append( 'string' )
   * element.append( document.querySelector('.box') )
   */

  append(...nodes: (string | Node)[]) {

    if (nodes) {

      nodes.forEach(node => this.instance.append(node))

      this.emitter.dispatch('append', nodes)

    }

    return this;

  }

  /**
   * listen
   * @description Écoute l'emetteur gréffé à l'élément
   * @param type Type d'émission
   * @param callback Fonction de rappel retournant la valeur associé au `type`
   * @example
   * element.listen( 'EMITTER_TYPE', data => ... )
   * element.listen<IElementEmitterScheme>( 'EMITTER_TYPE', data => ... )
   */
  listen<L extends keyof IElementEmitterScheme>(

    type: L,

    callback: IEventDispatcherCallback<IElementEmitterScheme[L]>

  ) {

    this.emitter.listen<L>(type, callback)

    return this;

  }

  /**
   * on
   * @description Écoute les évènement gréffé à l'instance de l'élément
   * @param type 
   * @param callback 
   * @param options 
   * @example
   * element.on<PointerEvent>( 'LISTENER_TYPE', ev => ... )
   */
  on<T extends keyof HTMLElementEventMap>(

    type: T,

    callback: IElementEventCallback<T>,

    options?: AddEventListenerOptions | boolean | undefined

  ) {

    this.instance.addEventListener(type, callback, options)

    this.emitter.dispatch('on', { type, callback, options })

    return this;

  }

  /**
   * style
   * @description Définit le style de l'instance lié à l'élément
   * @param properties Propriétés et valeurs à définir
   * @example
   * element.style( {
   *    'property': 'value'
   * } ) 
   */
  style(properties: IElementCSS | undefined) {

    if (properties) {

      Object.entries(properties).forEach(({ 0: name, 1: value }) => {

        this.instance.style[name as any] = `${value}`

      })

      this.emitter.dispatch('style', properties)

    }

    return this;

  }

  /**
   * removeStyle
   * @description Suprrime les propriétés de style de l'instance lié à l'élément
   * @param properties Tableau des propriétés à supprimer
   * @example
   * element.removeStyle( [ 'color', 'fontSize', ... ]) 
   */
  removeStyle(properties: IElementCSSRemoves) {

    if (Array.isArray(properties)) {

      properties.forEach(name => {

        this.instance.style.removeProperty(name as string)

      })

      this.emitter.dispatch('removeStyle', properties)

    }

    else if (typeof properties == 'string') {

      this.instance.style.removeProperty(properties)

      this.emitter.dispatch('removeStyle', properties)

    }

    return this;

  }

  /**
   * toggle
   * @description Basculer sur une selecteur CSS ou pas 
   * @param tokens Selecteur ou liste de sélecteur 
   * @example 
   * element.toggle( '.box' )
   * element.toggle( ['.box', '.card', ... ] )
   */
  toggleClassname(tokens: IElementClassName) {

    if (Array.isArray(tokens)) {

      tokens.forEach(name => {

        this.instance.classList.toggle(name)

      })

      this.emitter.dispatch('toggle', tokens)

    }

    else if (typeof tokens == 'string') {

      this.instance.classList.toggle(tokens)

      this.emitter.dispatch('toggle', tokens)

    }

    return this;

  }



  addInlineClassname(tokens: string) {

    tokens.split(' ').forEach(token => {

      if (token) {

        this.instance.classList.add(token)

        this.emitter.dispatch('className', token)

      }

    })

    return this;

  }


  /**
   * className
   * @description Associé un selecteur CSS
   * @param tokens Selecteur CSS
   */
  classname(tokens: IElementClassName | undefined) {

    if (tokens) {

      if (typeof tokens == 'string') {

        this.addInlineClassname(tokens)

      }

      else if (Array.isArray(tokens)) {

        tokens.forEach(token => {

          this.addInlineClassname(token)

        })

      }

    }

    return this;

  }


  getClassname(): string[] {

    return this.instance.className.split(' ')

  }


  /**
   * removeClassName
   * @description Supprimer un selecteur CSS
   * @param tokens Selecteur CSS
   */
  removeClassname(tokens: IElementClassName) {

    if (Array.isArray(tokens)) {

      tokens.forEach(name => {

        this.instance.classList.remove(name)

      })

      this.emitter.dispatch('removeClassName', tokens)

    }

    else if (typeof tokens == 'string') {

      this.instance.classList.remove(tokens)

      this.emitter.dispatch('removeClassName', tokens)

    }

    return this;

  }

  /**
   * attribute
   * @description Definit le/les attribut(s)
   * @param attributes Attributs sous form d'object
   * @param ns Nom de l'espace
   * @param separator Séparateur de nom d'espace
   */
  attribute(

    attributes?: IAttributesMap | undefined,

    ns?: string | undefined,

    separator?: string | undefined

  ) {

    if (attributes) {

      Object.entries(AttributesObject<IAttributesMap>(attributes, ns, separator))

        .forEach(({ 0: name, 1: attribute }) => {

          this.instance.setAttribute(name, `${attribute}`)

        })

    }

    return this;

  }

  /**
   * attribute
   * @description Definit le/les attribut(s)
   * @param attributes Attributs sous form d'object
   * @param ns Nom de l'espace
   * @param separator Séparateur de nom d'espace
   */
  attributeNS(

    attributes?: IAttributesMap | undefined,

    ns?: string | undefined

  ) {

    if (attributes) {

      Object.entries(AttributesObject<IAttributesMap>(attributes, ns, ':'))

        .forEach(({ 0: name, 1: attribute }) => {

          this.instance.setAttribute(name, `${attribute}`)

        })

    }

    return this;

  }

  /**
   * removeAttribute
   * @description Supprime le/les attribut(s)
   * @param attributes Attributs sous form d'object
   * @param ns Nom de l'espace
   * @param separator Séparateur de nom d'espace
   */
  removeAttribute(

    attributes: IAttributesMap,

    ns?: string | undefined,

    separator?: string | undefined


  ) {

    Object.keys(AttributesObject<IAttributesMap>(attributes, ns, separator))

      .forEach(name => {

        this.instance.removeAttribute(name)

      })

    return this;

  }

  /**
   * toggleAttribute
   * @description Basculer le/les attribut(s)
   * @param attributes Attributs sous form d'object
   * @param ns Nom de l'espace
   * @param separator Séparateur de nom d'espace
   */
  toggleAttribute(

    attributes: IAttributesMap,

    ns?: string | undefined,

    separator?: string | undefined


  ) {

    Object.entries(AttributesObject<IAttributesToggleMap>(attributes, ns, separator))

      .forEach(({ 0: name, 1: forced }) => {

        this.instance.toggleAttribute(name, forced)

      })

    return this;

  }

}


/**
 * AUN State
 * @description Gestionnaire d'état
 */
export class AunState<S extends IState> implements IStateManager<S>{

  #mirror: S;

  #recorded: Array<IStateRecords<S>> = []

  #current: IWidget<any, any> | undefined = undefined;

  /**
   * Donnée de l'état
   */
  state: S;

  /**
   * Emetteur
   */
  emitter = new EventDispatcher<IStateManagerEmitterScheme<S>>();

  /**
   * Retourne la valeur de l'état
   */
  get value() { return this.#mirror; }



  constructor(state: S) {

    this.state = state;

    this.#mirror = state;

    // this.#store = state;

    this.#emitters().initialize();

  }


  #emitters() {

    this.emitter.listen('change', () => {

      this.sync()

    })

    return this;

  }

  /**
   * initialize
   * @description Initialise l'état
   */
  initialize() {

    const driver = this;

    /**
     * Initialize le detecteur d'état sur des objets
     */
    if (this.state && typeof this.state == 'object') {

      this.#mirror = (new Proxy(

        Object.assign({}, this.state),

        {

          set(target, prop, newValue) {

            if (typeof prop == 'string') {

              //@ts-ignore
              target[prop as keyof IStateObject] = newValue

            }

            driver.emitter.dispatch('change', newValue)

            return newValue

          },

        }

      ))

      this.emitter.dispatch('init', this.state)

    }

    /**
     * Initialize le detecteur d'état sur les autres types de données
     */
    else {

      Object.defineProperty(

        this, 'state', {

        set(value) {

          driver.#mirror = value;

          driver.emitter.dispatch('change', value)

        },

        get() {

          const value = driver.#mirror

          // driver.emitter.dispatch('change', value )

          return value;

        }

      }

      )

      this.emitter.dispatch('init', this.state)

    }

    return this;

  }



  change(callback: IStateVoidCallback<S>) {

    this.emitter.listen('change', payload => {

      callback(payload)

    })

    return this;

  }



  /**
   * set
   * @description Modifit l'état
   * @param value Nouvelle valeur de l'état
   * @example
   * state.set( ... )
   */
  set(value: S): this {

    if (

      this.state && value &&

      typeof this.state == 'object' &&

      typeof value == 'object'

    ) {

      try {

        Object.entries(Object.assign({}, value)).forEach(({ 0: prop, 1: data }) => {

          if (this.#mirror && typeof this.#mirror == 'object') {

            this.#mirror[prop] = data;

          }

        })

      } catch (err) { }

    }

    else {

      this.state = value;

    }

    return this;

  }

  /**
   * use
   * @description Utilise l'état
   * @param callback Fonction de rappel contenant l'état en paramètre. Cett fonction doit retourner un widget
   * @example
   * state.use( state => ... )
   */
  use(callback: IStateCallback<S>) {

    this.#recorded.push({

      anchor: undefined,

      widget: undefined,

      callback

    })

    return this;

  }

  /**
   * records
   * @description Enregistre les déclarations de l'état pour le référencement
   * @param widget Widget enregistré
   * @example
   * state.records( ... )
   */
  records(widget: IWidget<any, any>): this {

    this.#recorded.forEach(record => this.record(widget, record))

    return this;

  }

  /**
   * record
   * @description Engistre la déclaration du widget
   * @param widget Widget
   * @param record Enregistrement de la déclaration
   * @example
   * state.record( widget, record )
   */
  record(widget: IWidget<any, HTMLElement>, record: IStateRecords<any>): IStateRecords<any> {

    const anchor = document.createTextNode('');

    record.anchor = anchor;

    record.widget = widget;

    widget.element.instance.append(record.anchor);

    return record

  }

  /**
   * sync
   * @description Synchronise l'état et les déclarations
   * @example
   * state.sync()
   */
  sync(): this {

    try {

      this.#recorded.forEach(record => {

        if (record.widget && record.anchor) {

          this.#current = record.callback(this.value)

          record.anchor.parentNode?.replaceChild(this.#current?.element.instance, record.anchor)

          record.anchor = this.#current?.element.instance

        }

      })

    }
    catch (err) { this.emitter.dispatch('error', err); }

    return this;

  }

  /**
   * catch
   * @description Gestion des érreurs
   * @param callback Fonction de rappel. Cette fonction doit retrouner un Widget
   * @example
   * state.catch( error => ... )
   */
  catch(callback: IStateErrorCallback<S>) {

    this.emitter.listen<'error'>('error', (error: unknown) =>

      callback({ manager: this, error })

    )

    return this;

  }


}

/**
 * AUN Widget
 * @description Pour les composant HTML de base
 */
export class AunWidget<P extends IWidgetBaseProps, E extends INode> implements IWidget<P, E>{

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
  get props() { return this.#_props; }

  #_props: P;


  /**
   * Emetteur
   */
  emitter = new EventDispatcher<IWidgetEmitterScheme<P, E>>();

  /**
   * Constructe
   */
  construct: IConstruct<P, E> = new AunConstruct<P, E>();

  constructor(tagname: string, props: P) {

    this.#_props = this.#excavation(props);

    this.element = (new AunElement<E>(tagname)).own<P>(this);

  }

  append(...nodes: Array<string | Node>): this {

    this.element.instance.append(...nodes)

    return this;

  }

  #excavation(props: P) {

    const p: P = {} as P

    Object.entries(props).forEach(({ 0: key, 1: value }) => {

      if (key == 'child') { this.child = value; }

      else { p[key as keyof P] = value as P[keyof P]; }

    })

    this.emitter.dispatch('excavation', this)

    return p;

  }

  ready(callback: IWidgetReadyCallback<P, E>) {

    this.emitter.listen('ready', widget => callback(widget))

    return this;

  }

  manipulate(callback: IWidgetLayerCallback<E>) {

    callback(this.element)

    return this;

  }

  /**
   * appear
   * @description Definit une apparence pour le widget
   * @param payload Propriété de l'apparence
   * @example
   * widget.appear( {
   *    'property' : 'value'
   * } )
   */
  appear(payload: IAppearanceObject): this {

    this.construct.makeAppearance(this, payload)

    return this;

  }

  /**
   * content
   * @description Definit le contenu du widget
   * @param child Contenu du widget
   * @example
   * widget.content( ... )
   */
  content(child?: IChildren | IChildren[] | undefined): this | IChildren {

    if (this.child) {

      const nchildren: IChildren[] = []

      nchildren.forEach(child => nchildren.push(child))

    }

    this.construct.make(this, child)

    this.child = child

    return this;

  }

  /**
   * refresh
   * @description Rafraichit un widget
   * @example
   * widget.refresh()
   */
  refresh(props?: Partial<P> | undefined): this {

    this.element.clean()

    if (props) {

      Object.entries(props).forEach(({ 0: name, 1: prop }) =>

        this.#_props[name as keyof P] = prop

      )

    }

    this.content(this.child)

    return this;

  }

  /**
   * render
   * @description Rend le widget
   */
  render(): this {

    this.element.classname(this.construct.appearance.uid)

    this.construct.make(this, this.child);

    return this;

  }

  /**
   * remove
   * @description Détruit le widget
   */
  remove(): this {

    this.construct.appearance.destroy()

    this.element.instance.remove()

    this.emitter.dispatch('remove', undefined)

    return this;

  }

  /**
   * timeOut
   * @description Execute une fonction après un temps donnée
   * @param callback Fonction de rappel retournant un widget et le timer
   * @param time Durée du compte à rebour
   * @example
   * widget.timeOut( ( widget, timer ) => ... )
   */
  timeOut(callback: IWidgetTimerCallback, time?: number) {

    let timer: NodeJS.Timeout | undefined = undefined;

    const handler = () => timer ? callback(this, timer) : undefined;

    timer = setTimeout(handler, time || 500);

    return this;

  }

  /**
   * timeInterval
   * @description Execute une fonction à un interval de temps
   * @param callback Fonction de rappel retournant un widget et le timer
   * @param time Durée de l'interval 
   * @example
   * widget.timeInterval( ( widget, timer ) => ... )
   */
  timeInterval(callback: IWidgetTimerCallback, time?: number) {

    let timer: NodeJS.Timeout | undefined = undefined;

    const handler = () => timer ? callback(this, timer) : undefined;

    timer = setInterval(handler, time || 500);

    return this;

  }

  /**
   * frameReady
   * @description Execute une fonction quand permet l'animation des frames
   * @param callback Fonction de rappel appelent un widget en argument
   * @example
   * widget.frameReady( widget => ... )
   */
  frameReady(callback: IWidgetRequestAnimationFrameCallback) {

    requestAnimationFrame(() => callback(this))

    return this;

  }


}

/**
 * AUN Construct
 * @description Constructeur de Widget
 */
export class AunConstruct<P extends IWidgetBaseProps, E extends INode> implements IConstruct<P, E>{

  /**
   * Emetteur
   */
  emitter = new EventDispatcher<IConstructEmitterScheme<P, E>>();

  /**
   * Apparence
   */
  appearance: IAppearance = new CoreAppearance();


  constructor() {

    this.appearance.emitter.listen('sync', appear => {

      this.emitter.dispatch('appearance', appear)

    })

    this.appearance.mount();

  }

  /**
   * make
   * @description Créer le constructeur
   * @param root Racine Widget
   * @param child Enfants à ajouter
   */
  make(root: IWidget<P, E>, child: IChildren) {

    this.emitter.dispatch('before', root)

    root.emitter.dispatch('beforeRendering', child)

    this.makeChildren(root, child);

    root.emitter.dispatch('afterRendering', child)

    this.makeRoot(root);

    this.emitter.dispatch('after', root)

    root.emitter.dispatch('ready', root)

    return root;

  }


  makeRoot(root: IWidget<P, E>): IWidget<P, E> {

    if (typeof root.props == 'object') {

      Object.entries(root.props).forEach(({ 0: slug, 1: value }) => {

        this.propertyBuilder(root, slug, value);

      })

    }

    return root;

  }



  propertyBuilder(root: IWidget<P, E>, slug: keyof IWidgetBaseProps, value: any) {

    if (slug != 'child') {

      switch (slug) {

        case 'style': root.element.style(value as IElementCSS); break;

        case 'removeStyle': root.element.removeStyle(value as IElementCSSRemoves); break;

        case 'toggleClassname': root.element.toggleClassname(value as IElementClassName); break;

        case 'classname': root.element.classname(value as IElementClassName); break;

        case 'removeClassname': root.element.removeClassname(value as IElementClassName); break;

        case 'inlineClassname': root.element.addInlineClassname(value as string); break;

        case 'measure': root.element.measure(value as IElementMeasureCallback); break;

        case 'offset': root.element.offset(value as IElementOffsetCallback); break;

        case 'html': root.element.html(value as (string | undefined)); break;

        case 'append': root.element.append(value as string | Node); break;

        case 'append': root.element.append(value as string | Node); break;

        case 'data':

          Object.entries(value).forEach(({ 0: key, 1: value }) =>

            root.element.data(key, typeof value == 'object' ? JSON.stringify(value) : `${value}`)

          )

          break;

        case 'attribute':

          if (Array.isArray(value)) {

            (value as IWidgetAttributeProps[]).forEach(prop => {

              root.element.attribute(prop.attributes, prop.ns, prop.separator);

            })

          }

          else if (typeof value == 'object') {

            const props: IWidgetAttributeProps = value;

            root.element.attribute(props.attributes, props.ns, props.separator);

          }

          break;

        case 'removeAttribute':

          if (Array.isArray(value)) {

            (value as IWidgetAttributeProps[]).forEach(prop => {

              root.element.removeAttribute(prop.attributes, prop.ns, prop.separator);

            })

          }

          else if (typeof value == 'object') {

            const props: IWidgetAttributeProps = value;

            root.element.removeAttribute(props.attributes, props.ns, props.separator);

          }

          break;

        case 'toggleAttribute':

          if (Array.isArray(value)) {

            (value as IWidgetAttributeProps[]).forEach(prop => {

              root.element.toggleAttribute(prop.attributes, prop.ns, prop.separator);

            })

          }

          else if (typeof value == 'object') {

            const props: IWidgetAttributeProps = value;

            root.element.toggleAttribute(props.attributes, props.ns, props.separator);

          }

          break;

        case 'attributeNS':

          if (Array.isArray(value)) {

            (value as IWidgetAttributeNSProps[]).forEach(prop => {

              root.element.attributeNS(prop.attributes, prop.ns);

            })

          }

          else if (typeof value == 'object') {

            const props: IWidgetAttributeNSProps = value;

            root.element.attributeNS(props.attributes, props.ns);

          }

          break;

      }

    }

    return this;

  }




  /**
   * makeChildren
   * @description Construire les enfants
   * @param root Racine Widget
   * @param child Enfants à ajouter
   */
  makeChildren(root: IWidget<P, E>, child: IChildren) {

    if (child instanceof Element) {

      root.element.instance.append(child)

      root.emitter.dispatch('elementAdded', child)

      root.emitter.dispatch('childAdded', child)

    }


    else if (child instanceof AunState) {

      child.records(root)

      root.emitter.dispatch('stateAdded', child)

      root.emitter.dispatch('childAdded', child)
    }


    else if (

      typeof child == 'string' ||

      typeof child == 'boolean' ||

      typeof child == 'number'

    ) {

      root.element.instance.innerHTML = (`${child}`)

      root.emitter.dispatch('htmlAdded', child)

      root.emitter.dispatch('childAdded', child)

    }

    else if (child instanceof AunWidget) {

      root.element.instance.append(child.element.instance)

      root.emitter.dispatch('widgetAdded', child)

      root.emitter.dispatch('childAdded', child)

      child.emitter.dispatch('ready', child)

    }

    else if (Array.isArray(child)) {

      child.forEach(child => this.make(root, child))

    }

    if (child instanceof Promise) {

      const anchor = document.createTextNode('')

      root.element.instance.append(anchor)

      child.then(component => {

        root.element.instance.replaceChild(component.element.instance, anchor)

        root.emitter.dispatch('promiseAdded', child)

        root.emitter.dispatch('childAdded', child)

      }).catch(er => {

        throw (`AunConstruct : ${JSON.stringify(er)}`)

      })

    }

    return root;

  }

  /**
   * makeAppearance
   * @description Construire l'apparence
   * @param root 
   * @param payload 
   */
  makeAppearance(root: IWidget<P, E>, payload: IAppearanceObject) {

    this.appearance.set(payload)

    return root;

  }


}

export class AunView<

  ComponentProps extends IWidgetBaseProps

> implements IView<ComponentProps>{

  get parameters(): ComponentProps { return this.#_parameters }

  #_parameters: ComponentProps = {} as ComponentProps;

  get component(): IWidget<ComponentProps, HTMLDivElement> | undefined { return this.#_component }

  #_component: IWidget<ComponentProps, HTMLDivElement> | undefined = undefined;

  options: IViewOptions<ComponentProps>;

  componentConstructor: IComponentConstructor;


  constructor(componentConstructor: IComponentConstructor, options?: IViewOptions<ComponentProps>) {

    this.componentConstructor = componentConstructor;

    this.options = options || {} as IViewOptions<ComponentProps>;

  }


  show(parameters: ComponentProps): this {

    this.#_parameters = parameters;

    this.component?.element.removeStyle('display')

    return this;

  }


  hide(): this {

    this.component?.element.style({ display: 'none' })

    return this;

  }

  refresh(parameters?: Partial<ComponentProps> | undefined): this {

    // Mise à jour des paramètre
    this.#_parameters = UpdateObject<ComponentProps>(this.#_parameters, parameters)

    // Reconstruit le composant
    const render = this.render()

    // Remplacement basket
    this.component?.element.instance.parentNode?.replaceChild(

      render.element.instance,

      this.component?.element.instance

    )

    return this;

  }

  render() {

    this.#_component = this.componentConstructor(this.parameters)

    return this.#_component;

  }


}

export class AunStackViews<Scheme> implements IStackViews<Scheme>{

  /**
   * Les vues
   */
  get views() { return this.#views }


  #views: IStackViewsList<Scheme> = {} as IStackViewsList<Scheme>;


  /**
   * Composant Actuellement utilisé
   */
  get current() { return this.#current };

  #current: IWidget<any, any> | undefined = undefined;

  /**
   * Dernier composant utilisé
   */
  last: IWidget<any, any> | undefined = undefined;


  /**
   * Options
   */
  options: IStackViewsOptions<Scheme> = {} as IStackViewsOptions<Scheme>


  /**
   * Système de navigation
   */
  navigation: INavigation<Scheme> = new Navigation<Scheme>();

  /**
   * Emétteur
   */
  emitter: IEventDispatcher<IStackViewsEmitterScheme<Scheme>> = new EventDispatcher<IStackViewsEmitterScheme<Scheme>>()


  constructor(

    views: IStackViewsList<Scheme>,

    options: IStackViewsOptions<Scheme>

  ) {

    this.#views = views;

    this.options = options || {} as IStackViewsOptions<Scheme>;

    this.navigation.setOptions({

      middlewares: [

        this.#defaultMiddleware.bind(this),

        ...(this.options.middlewares || []),

      ],

      useHashtagParser: (typeof this.options.useHashtagParser != 'undefined')

        ? this.options.useHashtagParser

        : true,

      capture: (typeof this.options.capture != 'undefined')

        ? this.options.capture

        : true,

    })

    this.#initializeCanvas();

  }

  #initializeCanvas() {

    findElement(this.options.canvas, canvas => {

      canvas.style.position = 'relative';

      canvas.style.width = '100%';

      canvas.style.height = '100%';

      canvas.style.overflow = 'hidden';

      canvas.style.maxWidth = '100vw';

      canvas.style.maxHeight = '100vh';

    })

    return this;

  }

  middleware(callback: INavigationMiddlewareCallback<Scheme>): this {

    this.navigation.options.middlewares?.push(callback)

    return this;

  }

  #getOldView(): IStackViewsList<Scheme>[keyof Scheme] | undefined {

    const name = (this.navigation.oldRouteName() as (string | undefined))?.split('?')[0] as keyof Scheme | undefined;

    return name ? this.#views[name] || undefined : undefined;

  }

  #createViewProps(

    props: IWidgetBaseProps | Scheme[keyof Scheme] | undefined

  ): IViewProps {

    return {

      ...(props || {}),

      stack: this

    }

  }


  #defaultMiddleware({ props, routeName }: INavigationMiddlewareProps<Scheme>): this {

    const view: IStackViewsList<Scheme>[keyof Scheme] | undefined = this.#views[routeName] || undefined;

    if (view && this.options.canvas) {

      findElement(this.options.canvas, canvas => {

        const component = view.componentConstructor(this.#createViewProps(props));

        const transitionAvailable = view?.options.transitions && component.element.instance;

        const oldView = this.#getOldView();


        this.#current = component;

        component.element.style({

          position: 'absolute',

          top: '0',

          left: '0',

          zIndex: '2'

        });

        if (view.options.title) { document.title = `${view.options.title}` }

        if (this.last) {

          component.element.style({

            position: 'absolute',

            top: '0',

            left: '0',

            zIndex: '1'

          })

        }

        if (transitionAvailable) {

          component.element.on('transitionend', () => {

          })

          view.options.transitions?.entry.startIn(component.element.instance, () => {

            this.last?.element.remove()

            this.last = component;

          })

          if (this.last) {

            oldView?.options.transitions?.exit.startOut(this.last.element.instance, () => { });

          }

          canvas.append(component.element.instance)

        }

        if (!transitionAvailable) {

          canvas.innerText = '';

          canvas.append(component.element.instance)

          this.last = component;

        }


      })


    }

    else {

      this.emitter.dispatch('error', routeName)

    }

    return this;

  }

  /**
   * Démarrage
   */
  run(): this {

    this.navigation.observe()

    if (this.options.index) {

      this.navigation.navigate(

        this.navigation.currentRouteName() || this.options.index,

        this.navigation.currentQuery() || undefined,

        undefined

      )

    }

    return this;

  }


}

