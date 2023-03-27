
import type { 
  IAppearance, 
  IAppearanceEmitterScheme, 
  IAppearanceObject, 
  IAppearanceObjectDestroyed, 
  IAppearanceStyleSheet, 
  IAppearanceValues, 
  IAttribute, 
  IAttributesEmitterScheme, 
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
  IEmitter, 
  IEmitterCallback, 
  IEmitterEntries, 
  IEmitterProgations, 
  IEmitterScheme, 
  IFindElementCallback, 
  INavigation, 
  INavigationEmitterScheme, 
  INavigationMiddlewareCallback, 
  INavigationMiddlewareProps, 
  INavigationOptions, 
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
  IAnimate, 
  IAnimateCallback, 
  IAnimateTarget, 
  IView, 
  IViewOptions, 
  IWidget, 
  IWidgetEmitterScheme, 
  IWidgetLayerCallback, 
  IWidgetReadyCallback, 
  IWidgetRequestAnimationFrameCallback, 
  IWidgetTimerCallback, 
  IWProps, 
  IWTarget, 
  IWTargetNode,
  ITransition,
  ITransitionProps,
  IAnimateOptions,
  IAnimateEmitterScheme,
  IAnimateInterpolarities,
  IAnimateElementOptions,
  IAnimateElementProperties,
  ITransitionDoneCallback
} from "./types";

import { MetricRandom } from "./metric";

import { 
  AttributesObject, 
  AscendingDOMPath, 
  ObjectToString, 
  UnCamelize, 
  UpdateObject,
  URLParamsObject
} from "./utilities";



/**
 * fe — Find Element
 * @param find Recherché
 * @param callback Fonction de rappel contenant l'element html en argument
 */
export function fe( 
  
  find : IWTarget | undefined, 
  
  callback ?: IFindElementCallback 
  
) : IWTargetNode | undefined {

  const fn = callback || new Function()
  
  let target = undefined;

  if( find ){

    if( typeof find == 'string' ){ 
      
      target = document.querySelectorAll<HTMLElement>( find ); 

      target.forEach( element => fn( element ))
      
    }

    else if( find instanceof NodeList ){ 
      
      target = find; 
      
      target.forEach( element => fn( element ))
      
    }

    else if( find instanceof HTMLElement ){ 
      
      target = find; 
      
      fn( target )
      
    }

    else if( find instanceof AunElement ){ 
      
      target = find.instance; 
      
      fn( target )
      
    }

  }
  
  return target;
  
}

/**
 * AUN EventDispatcher — Emetteur d'émission
 * @description Gestionnaire d'évènements
 * @example new AunEmitter<EmitScheme>()
 */
export default class AunEmitter<Scheme extends IEmitterScheme> implements IEmitter<Scheme> {

  /**
   * Gestion de la propagation
   */
  propagations: IEmitterProgations<Scheme> = {} as IEmitterProgations<Scheme>;

  /**
   * Stockage des émissions
   */
  entries: IEmitterEntries<Scheme> = {} as IEmitterEntries<Scheme>;

  /**
   * Ecouter une émission de l'émetteur
   * @description Ecouteur d'évèvements par rapport à un "SLUG". Utiliser un retour "TRUE" pour stopper la propagation de l'instance déclenchée
   * @param type Type d'émission déclaré dans le `Scheme` de l'instanciation
   * @param callback Fonction de rappel content en `argument[0]` les données définit par le dispatcher
   * @example emitter.listen<ReturnType>( 'emitterNameInKeyOfScheme', ( data : ReturnType ) => ... )
   */
  listen<I extends keyof Scheme>( 
    
    type : I, 
    
    callback : IEmitterCallback<Scheme[I]>, force ?: boolean | undefined 
    
  ) : this{

    this.entries[ type ] = this.entries[ type ] || []

    this.entries[ type ].push( { callback, force })

    this.propagations[ type ] = false;

    return this;
    
  }

  /**
   * Déclencheur un type d'émission de l'émetteur
   * @description Déclencheur les écouteurs par rapport au `type`
   * @param type Type d'émission déclaré dans le `Scheme` de l'instanciation
   * @param data Donnée à renvoyer aux écouteurs d'émission de l'émeteur
   * @example emitter.dispatch( 'emitterNameInKeyOfScheme', ... )
   * 
   */
  dispatch( type : keyof Scheme, data: any ) : this{

    if( this.entries[ type ] ){

      this.entries[ type ].map( (entry) => {

        if( this.propagations[ type ] === true ){ return; }

        const stop = entry.callback( data )

        if( stop === true ){ this.propagations[ type ] = true; }
        
      })
      
      this.propagations[ type ] = false;
      
    }

    return this;
    
  }
  

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
  instance : E;

  /**
   * Emetteur
   */
  emitter = new AunEmitter<IElementEmitterScheme>()

  /**
   * Widget associé
   */
  get widget(){ return this.#widget; }
  
  #widget : IWidget<any, E> | undefined = undefined

  

  constructor( tagname : string ){

    this.instance = document.createElement( tagname ) as E;
    
  }

  /**
   * own
   * @description Définit le widget propriétaire de l'élément
   * @param widget Widget Cible
   * @example element.own( widget )
   */
  own<P extends IWProps>(widget: IWidget<P, E> ): this {

    this.#widget = widget;
      
    this.emitter.dispatch( 'own', widget )
  
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

    this.emitter.dispatch( 'measure', data )
  
    return data;
    
  }

  /**
   * measure
   * @description Execute asyncMeasure mais avec un callback
   * @param callback Fonction de rappel retournant la valeur en argument
   * @example element.measure( measure => ... )
   */
  measure( callback : IElementMeasureCallback ) { 

    callback( this.asyncMeasure() )
    
    return this; 
  
  }

  /**
   * clean
   * @description Nettoie le contenu de l'instance de l'élément
   * @example element.clean()
   */
  clean() { 

    Object.values( this.instance.children ).forEach( child => child.remove() )
    
    this.emitter.dispatch( 'clean', undefined )
  
    return this; 
  
  }

  /**
   * remove
   * @description Supprime l'élément
   * @example element.remove()
   */
  remove() { 

    this.instance.remove();
    
    this.emitter.dispatch( 'remove', undefined )
  
    return this; 
  
  }

  /**
   * asyncOffset
   * @description Retrouve les valeurs de l'`offset` de l'intance de l'élément en les retournant
   * @example element.asyncOffset()
   */
  asyncOffset() { 

    const data = {

      height : this.instance.offsetHeight,

      width : this.instance.offsetWidth,

      top : this.instance.offsetTop,

      left : this.instance.offsetLeft,

      parent : this.instance.offsetParent,
      
    }; 

    this.emitter.dispatch( 'offset', data )

    return data;
    
  }

  /**
   * offset
   * @description Exécute `asyncOffset` mais avec une fonction de rappel. 
   * Ceci permet d'enchaine avec une autre methode
   * @param callback Fonction de rappel retournant la valeur en argument
   * @example element.offset( offset => ... )
   */
  offset( callback : IElementOffsetCallback ){

    callback( this.asyncOffset() )

    return this;
    
  }

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
  content( children ?: IChildren | IChildren[] | undefined ) { 

    if( typeof children != 'undefined' ){

      this.widget?.construct.make( this.widget, children )

      this.emitter.dispatch( 'content', children )

      return this; 

    }

    return this.widget?.children
      
  }

  /**
   * html
   * @description Définit un contenu HTML dans l'élément
   * @param data Contenu HTML
   * @example
   * element.html( 'string' )
   */
  html( data ?: string | undefined ) { 

    if( typeof data != 'undefined' ){

      this.instance.innerHTML = data
      
      this.emitter.dispatch( 'html', data )

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

  append( ...nodes: (string | Node)[] ) { 

    if( nodes ){

      nodes.forEach( node => this.instance.append( node ) )
      
      this.emitter.dispatch( 'append', nodes )

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
    
    type : L, 
    
    callback : IEmitterCallback<IElementEmitterScheme[L]>
    
  ) { 

    this.emitter.listen<L>( type, callback )
    
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
    
    type : T, 
    
    callback : IElementEventCallback<T>,

    options?: AddEventListenerOptions | boolean | undefined
    
  ) { 

    this.instance.addEventListener( type, callback, options )
    
    this.emitter.dispatch( 'on', { type, callback, options } )

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
  style( properties : IElementCSS | undefined ) { 

    if( properties ){

      Object.entries( properties ).forEach( ({ 0: name, 1: value }) => {

        this.instance.style[ name as any ] = `${ value }`
        
      } )

      this.emitter.dispatch( 'style', properties )

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
  removeStyle( properties : IElementCSSRemoves ) { 
    
    if( Array.isArray( properties ) ){

      properties.forEach( name => {

        this.instance.style.removeProperty( name as string )
        
      } )

      this.emitter.dispatch( 'removeStyle', properties )

    }

    else if( typeof properties == 'string'){

      this.instance.style.removeProperty( properties )
      
      this.emitter.dispatch( 'removeStyle', properties )

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
  toggle( tokens : IElementClassName ) { 

    if( Array.isArray( tokens ) ){

      tokens.forEach( name => {

        this.instance.classList.toggle( name )
    
      } )

      this.emitter.dispatch( 'toggle', tokens )

    }

    else if( typeof tokens == 'string'){

      this.instance.classList.toggle( tokens )
      
      this.emitter.dispatch( 'toggle', tokens )

    }
  
    return this; 
  
  }

  /**
   * className
   * @description Associé un selecteur CSS
   * @param tokens Selecteur CSS
   */
  className( tokens : IElementClassName | undefined ) { 

    if( tokens ){

      if( typeof tokens == 'string' ){

        this.instance.classList.add( tokens )

        this.emitter.dispatch( 'className', tokens )
  
      }
      
      else if( Array.isArray( tokens ) ){

        tokens.forEach( token => this.instance.classList.add( token ) )
        
        this.emitter.dispatch( 'className', tokens )
  
      }
      
      return this; 
      
    }
  
    return this.instance.className.split(' ')
    
  }

  /**
   * removeClassName
   * @description Supprimer un selecteur CSS
   * @param tokens Selecteur CSS
   */
  removeClassName( tokens : IElementClassName ) { 
    
    if( Array.isArray( tokens ) ){

      tokens.forEach( name => {

        this.instance.classList.remove( name )
    
      } )

      this.emitter.dispatch( 'removeClassName', tokens )
  
    }

    else if( typeof tokens == 'string'){

      this.instance.classList.remove( tokens )
      
      this.emitter.dispatch( 'removeClassName', tokens )
  
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
    
    attributes ?: IAttributesMap | undefined, 
    
    ns?: string | undefined, 
    
    separator?: string | undefined 
    
  ) { 

    if( attributes ){

      Object.entries( AttributesObject<IAttributesMap>( attributes, ns, separator ) )
      
      .forEach( ({ 0: name, 1: attribute }) => {

        this.instance.setAttribute( name, `${ attribute }` )
        
      } )
      
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
    
    attributes ?: IAttributesMap | undefined, 
    
    ns?: string | undefined
    
  ) { 

    if( attributes ){

      Object.entries( AttributesObject<IAttributesMap>( attributes, ns, ':' ) )
      
      .forEach( ({ 0: name, 1: attribute }) => {

        this.instance.setAttribute( name, `${ attribute }` )
        
      } )
      
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
    
    attributes : IAttributesMap,

    ns?: string | undefined, 
    
    separator?: string | undefined 
    
    
  ) { 

    Object.keys( AttributesObject<IAttributesMap>( attributes, ns, separator ) )
    
    .forEach( name => {

      this.instance.removeAttribute( name )
      
    } )
    
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

    attributes : IAttributesMap,

    ns?: string | undefined, 
    
    separator?: string | undefined 
    

  ) { 

    Object.entries( AttributesObject<IAttributesToggleMap>( attributes, ns, separator ) )
    
    .forEach( ({ 0: name, 1: forced }) => {

      this.instance.toggleAttribute( name, forced )
      
    } )

    return this; 

  }
  
}

/**
 * AunrseAppearanceProps
 * @description Analyse la propriété de l'apparence et la réecrit
 * @param name Nom de la propriété
 * @param value Valeur de la propriété
 * @example 
 * AunrseAppearanceProps<IAppearanceObject>( { color : '#777' } )
 */
export function AunrseAppearanceProps<T extends IAppearanceObject | IAppearanceObjectDestroyed>( 
  
  name : keyof IAppearanceObject, 
  
  value : IAppearanceValues 
  
) : T {

  const keys : string[] = [];

  const parsed : T = {} as T

  /**
   * Réecriture
   */
  switch( name ){

    case 'paddingVertical': 
      
      keys.push( 'paddingTop' )

      keys.push( 'paddingBottom' )
      
    break;

    case 'paddingHorizontal': 
      
      keys.push( 'paddingLeft' )

      keys.push( 'paddingRight' )
      
    break;
    

    case 'marginVertical': 
      
      keys.push( 'marginTop' )

      keys.push( 'marginBottom' )
      
    break;
    
    case 'marginHorizontal': 
      
      keys.push( 'marginLeft' )

      keys.push( 'marginRight' )
      
    break;
   
    default:

      keys.push( name as string )

    break;
    
  }

  /**
   * Injection
   */
  keys.forEach( key => {

    parsed[ UnCamelize(key) as any ] = AunrseAppearanceValues( value )
    
  } )

  return parsed;
  
}

/**
 * AunrseAppearanceValues
 * @description Analyse la valeur d'une propriété de l'apparence
 * @param value Valeur de la propriété
 * @example 
 * AunrseAppearanceValues( ... )
 */
export function AunrseAppearanceValues( value : IAppearanceValues ){

  if( typeof value == 'number' ){

    return `${ value }`
    
  }

  return value;
  
}

/**
 * AUN Appearance
 * @description Gestionnaire d'apparence des éléments AUN
 */
export class AunAppearance implements IAppearance{

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
  emitter = new AunEmitter<IAppearanceEmitterScheme>();

  /**
   * Propriétés de l'apparence
   */
  properties : IAppearanceObject = {} as IAppearanceObject


  constructor(){

    this.instance = document.createElement('style')

    this.uid = `${ MetricRandom.CreateAplpha( 4 ).join('') }-${ MetricRandom.Create( 12 ).join('') }`
    
  }

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
  sheet( stylesheet: IAppearanceStyleSheet ): this {

    const styleSheet : string[] = []
      
    Object.entries( stylesheet ).forEach( ({ 0: name, 1: props }) => {

      const properties : IAppearanceObject = {} as IAppearanceObject

      const selector = (name.includes('&')) 
          
        ? name.replace( new RegExp('&', 'g'), `.${ this.uid }` )
        
        : `.${ this.uid } ${ name }`;


      const data = this.insertProperties( properties, props )

      styleSheet[ styleSheet.length ] = `${ selector }{ ${ ObjectToString(data,{ joiner:'; ' }) } }`
        
    });
    

    this.instance.innerHTML = styleSheet.join(' ')
      
    this.mountImmediat()
    
    return this;
    
  }

  /**
   * insertProperties
   * @description Insert des propriétés d'apparence dans un objet support. Analyse les propriétés et les valeurs avant de les insérer
   * @param properties Propriétés d'apparence support
   * @param data Données des propriétés à insérer
   * @example 
   * appearance.insertProperties( objectPropertiesSupport, objectDataToInsert )
   */
  insertProperties( properties : IAppearanceObject, data : IAppearanceObject ){

    Object.entries( data ).forEach( ({0: name, 1: value}) => {
        
      Object.entries( 
        
        AunrseAppearanceProps<IAppearanceObject>( name as keyof IAppearanceObject, value )
        
      ).forEach( ({ 0: key, 1: data }) => properties[ key as any ] = data )
      
    })

    this.emitter.dispatch( 'insertProperties', properties )
    
    return properties;
    
  }

  /**
   * removeProperties
   * @description Supprime des propriétés d'apparence dans un object support.
   * @param properties Propriétés d'apparence support
   * @param payload Données des propriétés à supprimer
   * @example
   * appearance.removeProperties( objectPropertiesSupport, objectDataToRemove )
   */
  removeProperties( properties : IAppearanceObject, payload : IAppearanceObjectDestroyed ){

    Object.values( payload ).forEach( name => {
      
      Object.entries( 
        
        AunrseAppearanceProps<IAppearanceObjectDestroyed>( name as keyof IAppearanceObject, undefined ) 
        
      ).forEach( ({ 0: key }) => properties[ key as any ] = undefined )
      
    })

    this.emitter.dispatch( 'removeProperties', properties )
    
    return properties;
    
  }
  
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
  set( properties : IAppearanceObject ) : this{

    this.insertProperties( this.properties, properties )

    this.emitter.dispatch( 'set', properties )
    
    return this.sync();
    
  }

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
  unset( properties : IAppearanceObjectDestroyed ) : this{

    this.removeProperties( this.properties, properties )

    this.emitter.dispatch( 'unset', properties )

    return this.sync();
    
  }

  /**
   * mount
   * @description Monter l'apparence si ce n'est pas fait
   * @example
   * appearance.mount()
   */
  mount() : this{

    const length = Object.values( this.properties ).length;

    if( !this.instance.isConnected && length ){

      this.mountImmediat();
      
    }

    return this;
    
  }

  /**
   * mountImmediat
   * @description Monter l'apparence
   * @example
   * appearance.mountImmediat()
   */
  mountImmediat() : this{

    let head = document.querySelector('head')

    if( !head ){

      head = document.createElement('head')

      document.documentElement.append( head )
      
    }
    
    head.append( this.instance )

    this.emitter.dispatch( 'mount', this )

    return this;
    
  }

  /**
   * destroy
   * @description Détruit l'apparence
   * @example
   * appearance.destroy()
   */
  destroy() : this{

    this.instance.remove()
    
    this.emitter.dispatch( 'destroy', undefined )

    return this;
    
  }

  /**
   * sync
   * @description Synchronise l'apparence
   * @example
   * appearance.sync()
   */
  sync(): this {

    const rendering : string[] = []

    Object.entries( this.properties ).forEach( ({0: name, 1: value}) => {

      if( typeof value == 'string' || typeof value == 'number' ){
        
        rendering[ rendering.length ] = `${ UnCamelize( name ) } : ${ value }`
        
      }

    })

    this.instance.innerHTML = `.${ this.uid }{ ${ rendering.join(';') } }`
      
    this.emitter.dispatch( 'sync', this )

    this.mount()
    
    return this;
    
  }
  
}

/**
 * AUN Attribute
 * @description Gestionnaire d'attribute dynamique
 */
export class AunAttribute implements IAttribute {

  #entries : string[] = [];
  
  #element : HTMLElement | null = null;

  /**
   * Nom de lattribut
   */
  attributeName  = '';

  /**
   * Emetteur
   */
  emitter = new AunEmitter<IAttributesEmitterScheme>()

  /**
   * Les entrées
   */
  get entries(){ return this.#entries; }

  /**
   * La valeur de l'attribut
   */
  get value(){ return this.#entries.filter( value => value.trim().length ).join(' ').trim(); }

  constructor( element : HTMLElement | null, attributeName  = '' ){

    this.#element = element;

    this.attributeName = attributeName;

    this.sync( this.attributeName );
    
  }

  /**
   * sync
   * @description Synchronise les attributs
   * @param attributeName Nom de l'attribut
   * @description
   * attribut.sync()
   */
  sync( attributeName ?: string ){

    this.attributeName = attributeName || this.attributeName;

    (this.#element?.getAttribute(`${ this.attributeName }`)||'').split(' ')

    .filter( value => value.trim().length )
    
    .map( value => this.add(`${ value.trim() }`))

    this.emitter.dispatch('sync', { entries : this.#entries })
    
    return this;
    
  }

  /**
   * add
   * @description Ajout une entrée à l'attribut
   * @param value Valeur de l'attribut
   * @example
   * attribut.add( ... )
   */
  add( value : string ){

    if( !this.contains( value ) ){

      this.#entries.push( value )

      this.emitter.dispatch('add', { added : value })
    
    }

    return this;
    
  }
  
  /**
   * remove
   * @description Supprimer une entrée de l'attribut
   * @param value Valeur de l'attribut
   * @example
   * attribut.remove( ... )
   */
  remove( value : string ){

    this.#entries = this.#entries.filter( entry => entry != value );

    this.emitter.dispatch('remove', { removed : value })
    
    return this;
    
  }

  /**
   * replace
   * @description Remplace le valeur dans un attribut
   * @param older Ancienne valeur de l'attribut
   * @param value Nouvelle valeur de l'attribut
   * @example
   * attribut.replace( 'oldValue', 'newValue' )
   */
  replace( older : string, value : string ){

    this.remove( older ).add( value )
    
    this.emitter.dispatch('replace', { older, newer : value })
    
    return this;
    
  }

  /**
   * contains
   * @description Recherche l'existence d'une valeur dans l'instance de l'attribut
   * @param value Valeur dans l'attribut recherché
   * @example 
   * attribut.contains( 'searchValue' )
   */
  contains( value : string ){

    return this.#entries.includes( value, 0 )
    
  }
  
  /**
   * link
   * @description Lie un attribut à une instance du DOM
   * @example
   * attribut.link()
   */
  link(){

    this.#element?.setAttribute( this.attributeName , `${ this.value }`)

    this.emitter.dispatch('link', this )
    
    return this;

  }
  
  /**
   * unlink
   * @description Supprime la liaison d'un attribut dans  l'instance
   * @param attributes Nom de l'attribut
   * @example
   * attribut.unlink( 'attributName' )
   */
  unlink( attributes ?: string | string[] ){

    if( attributes ){
      
      if( Array.isArray( attributes ) ){ attributes.map( attribute => this.remove( attribute ) ); }

      this.#element?.setAttribute( this.attributeName , `${ this.value }`)

      this.emitter.dispatch('unlink', { value : attributes || this.value })
    
    }

    else{

      this.#element?.removeAttribute( this.attributeName  )
      
      this.emitter.dispatch('unlinks', this )
    
    }

    return this;

  }


}

/**
 * AUN State
 * @description Gestionnaire d'état
 */
export class AunState<S extends IState> implements IStateManager<S>{

  #mirror : S;

  #recorded : Array<IStateRecords<S>> = []

  #current : IWidget<any, any> | undefined = undefined;

  /**
   * Donnée de l'état
   */
  state : S;

  /**
   * Emetteur
   */
  emitter = new AunEmitter<IStateManagerEmitterScheme<S>>(); 
  
  /**
   * Retourne la valeur de l'état
   */
  get value(){ return this.#mirror; }



  constructor( state : S  ){

    this.state = state;

    this.#mirror = state;

    // this.#store = state;

    this.#emitters().initialize();
    
  }


  #emitters(){

    this.emitter.listen('change', () => {

      this.sync()
      
    } )
    
    return this;
    
  }
  
  /**
   * initialize
   * @description Initialise l'état
   */
  initialize(){

    const driver = this;

    /**
     * Initialize le detecteur d'état sur des objets
     */
    if( this.state && typeof this.state == 'object' ){
      
      this.#mirror = ( new Proxy(

        Object.assign( {}, this.state ),

        {

          set( target, prop, newValue ) {

            if(typeof prop == 'string' ){

              //@ts-ignore
              target[ prop as keyof IStateObject ] = newValue

            }
            
            driver.emitter.dispatch('change', newValue )
            
            return newValue
            
          },

        }
        
      ) )

      this.emitter.dispatch('init', this.state )
      
    }

    /**
     * Initialize le detecteur d'état sur les autres types de données
     */
    else{

      Object.defineProperty(

        this, 'state', {

          set( value ) {

            driver.#mirror = value;

            driver.emitter.dispatch('change', value )
              
          },

          get(){

            const value = driver.#mirror

            // driver.emitter.dispatch('change', value )
            
            return value;
            
          }
          
        }
        
      )
      
      this.emitter.dispatch('init', this.state )

    }
    
    return this;
    
  }

  /**
   * set
   * @description Modifit l'état
   * @param value Nouvelle valeur de l'état
   * @example
   * state.set( ... )
   */
  set( value: S): this {
      
    if( 
      
      this.state && value &&
      
      typeof this.state == 'object' && 
      
      typeof value == 'object' 
      
    ){

      try{

        Object.entries( Object.assign({}, value ) ).forEach( ({ 0: prop, 1: data }) => {

          if( this.#mirror && typeof this.#mirror == 'object'){
            
            this.#mirror[ prop ] = data;

          }
          
        })

      } catch( err ){  }
      
    }

    else{

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
  use( callback : IStateCallback<S> ){

    this.#recorded.push( {

      anchor: undefined,

      widget: undefined,

      callback
      
    } )

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

    this.#recorded.forEach( record => this.record( widget, record ) )
      
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
    
    widget.element.instance.append( record.anchor );
    
    return record
    
  }
  
  /**
   * sync
   * @description Synchronise l'état et les déclarations
   * @example
   * state.sync()
   */
  sync(): this {

    try{
        
      this.#recorded.forEach( record => {

        if( record.widget && record.anchor ){

          this.#current = record.callback( this.value )

          record.anchor.parentNode?.replaceChild( this.#current.element.instance, record.anchor )
          
          record.anchor = this.#current.element.instance
          
        }
        
      })
      
    }
    catch( err ){ this.emitter.dispatch('error', err ); }
    
    return this;
    
  }
  
  /**
   * catch
   * @description Gestion des érreurs
   * @param callback Fonction de rappel. Cette fonction doit retrouner un Widget
   * @example
   * state.catch( error => ... )
   */
  catch( callback : IStateErrorCallback<S> ){

    this.emitter.listen<'error'>('error', ( error : unknown )=>

      callback( { manager : this, error } )

    )

    return this;
    
  }

  
}

/**
 * AUN Widget
 * @description Pour les composant HTML de base
 */
export class AunWidget<P extends IWProps, E extends INode> implements IWidget<P, E>{

  /**
   * Instance de l'élément
   */
  element: IElement<E>;

  /**
   * Enfant du widget
   */
  children ?: IChildren | IChildren[] | undefined;

  /**
   * Les propriétés
   */
  get props() { return this.#_props; }

  #_props : P;


  /**
   * Emetteur
   */
  emitter = new AunEmitter<IWidgetEmitterScheme<P, E>>();

  /**
   * Constructe
   */
  construct : IConstruct<P, E> = new AunConstruct<P, E>();

  constructor( tagname : string, props : P ){

    this.#_props = props;

    this.element = ( new AunElement<E>( tagname ) ).own<P>( this );

    this.#excavation( this.props );

  }

  append( ...nodes : Array<string | Node> ) : this{

    this.element.instance.append (...nodes )

    return this;
    
  }

  #excavation( props : P ){

    Object.entries( props ).forEach( ({ 0 : key , 1 : value }) => {

      if( key == 'children' ){ this.children = value; }

      else{ this.#_props = value; }
      
    })

    this.emitter.dispatch( 'excavation', this )

    return this;
    
  }

  ready( callback : IWidgetReadyCallback<P, E> ){

    this.emitter.listen('ready', widget => callback( widget ) )

    return this;
    
  }

  layer( callback : IWidgetLayerCallback<E> ){

    callback( this.element )

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
  appear( payload : IAppearanceObject ): this {

    this.construct.makeAppearance( this, payload )

    return this;
    
  }
  
  /**
   * content
   * @description Definit le contenu du widget
   * @param children Contenu du widget
   * @example
   * widget.content( ... )
   */
  content( children ?: IChildren | IChildren[] | undefined ) : this | IChildren{

    if( this.children ){

      const nchildren : IChildren[] = []

      nchildren.forEach( child => nchildren.push( child ) )
      
    }
    
    this.construct.make( this, children )

    this.children = children
    
    return this;
    
  }

  /**
   * refresh
   * @description Rafraichit un widget
   * @example
   * widget.refresh()
   */
  refresh( props ?: Partial<P> | undefined ) : this{

    this.element.clean()

    if( props ){
      
      Object.entries( props ).forEach( ({0: name, 1: prop}) => 
        
        this.#_props[ name as keyof P ] = prop 
        
      )

    }

    this.content( this.children )

    return this;
    
  }

  /**
   * render
   * @description Rend le widget
   */
  render() : this{

    this.element.className( this.construct.appearance.uid )

    this.construct.make( this, this.children );
    
    return this;
    
  }
  
  /**
   * remove
   * @description Détruit le widget
   */
  remove() : this{

    this.construct.appearance.destroy()

    this.element.instance.remove()
    
    this.emitter.dispatch( 'remove', undefined )

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
  timeOut( callback : IWidgetTimerCallback, time ?: number ) {

    let timer : NodeJS.Timeout | undefined = undefined;

    const handler = () => timer ? callback( this, timer ) : undefined;

    timer = setTimeout( handler, time || 500 );
    
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
  timeInterval( callback : IWidgetTimerCallback, time ?: number ) {

    let timer : NodeJS.Timeout | undefined = undefined;

    const handler = () => timer ? callback( this, timer ) : undefined;

    timer = setInterval( handler, time || 500 );
    
    return this;
    
  }

  /**
   * frameReady
   * @description Execute une fonction quand permet l'animation des frames
   * @param callback Fonction de rappel appelent un widget en argument
   * @example
   * widget.frameReady( widget => ... )
   */
  frameReady( callback : IWidgetRequestAnimationFrameCallback ){

    requestAnimationFrame( () => callback( this ) )

    return this;
    
  }

  
}

/**
 * AUN Construct
 * @description Constructeur de Widget
 */
export class AunConstruct<P extends IWProps, E extends INode> implements IConstruct<P, E>{

  /**
   * Emetteur
   */
  emitter = new AunEmitter<IConstructEmitterScheme<P, E>>();

  /**
   * Apparence
   */
  appearance : IAppearance = new AunAppearance();


  constructor(){

    this.appearance.emitter.listen('sync', appear => {

      this.emitter.dispatch('appearance', appear )
      
    })
    
    this.appearance.mount();
    
  }
  
  /**
   * make
   * @description Créer le constructeur
   * @param root Racine Widget
   * @param children Enfants à ajouter
   */
  make( root : IWidget<P, E>, children : IChildren ) {

    this.emitter.dispatch('before', root )
      
      root.emitter.dispatch('beforeRendering', children )
      
        this.makeChildren( root, children )
      
      root.emitter.dispatch('afterRendering', children )
    
    this.emitter.dispatch('after', root )

    root.emitter.dispatch('ready', root )

    return root;
    
  }

  /**
   * makeChildren
   * @description Construire les enfants
   * @param root Racine Widget
   * @param children Enfants à ajouter
   */
  makeChildren( root : IWidget<P, E>, children : IChildren ){

    if( children instanceof Element ){

      root.element.instance.append( children )

      root.emitter.dispatch('elementAdded', children )
      
      root.emitter.dispatch('childAdded', children )
      
    }


    else if( children instanceof AunState ){

      children.records( root )

      root.emitter.dispatch('stateAdded', children )

      root.emitter.dispatch('childAdded', children )
    }
    

    else if( 
      
      typeof children == 'string' ||

      typeof children == 'boolean' ||

      typeof children == 'number' 

    ){

      root.element.instance.innerHTML = ( `${ children }` )
      
      root.emitter.dispatch('htmlAdded', children )
      
      root.emitter.dispatch('childAdded', children )
      
    }

    else if( children instanceof AunWidget ){

      root.element.instance.append( children.element.instance )

      root.emitter.dispatch('widgetAdded', children )
      
      root.emitter.dispatch('childAdded', children )

      children.emitter.dispatch('ready', children )

    }

    else if( Array.isArray(children) ){

      children.forEach( child => this.make( root, child ) )
      
    }

    if( children instanceof Promise ){

      const anchor = document.createTextNode('')

      root.element.instance.append( anchor )
      
      children.then( component => {

        root.element.instance.replaceChild( component.element.instance, anchor )

        root.emitter.dispatch('promiseAdded', children )

        root.emitter.dispatch('childAdded', children )

      }).catch( er => {

        throw(`AunConstruct : ${ JSON.stringify(er) }`)
        
      } )
      
    }
        
    return root;
    
  }

  /**
   * makeAppearance
   * @description Construire l'apparence
   * @param root 
   * @param payload 
   */
  makeAppearance( root : IWidget<P, E>, payload : IAppearanceObject ){

    this.appearance.set( payload )
    
    return root;
    
  }

  
}

export class AunView<

  ComponentProps extends IWProps
  
> implements IView<ComponentProps>{

  get parameters() : ComponentProps { return this.#_parameters }

    #_parameters : ComponentProps = {} as ComponentProps;

  get component() : IWidget<ComponentProps, HTMLDivElement> | undefined{ return this.#_component }

    #_component : IWidget<ComponentProps, HTMLDivElement> | undefined = undefined;

  componentConstructor : IComponentConstructor;

  options : IViewOptions<ComponentProps>;


  constructor( componentConstructor : IComponentConstructor, options ?: IViewOptions<ComponentProps> ){

    this.componentConstructor = componentConstructor;

    this.options = options || {} as IViewOptions<ComponentProps>;
    
  }


  show( parameters: ComponentProps ): this {

    this.#_parameters = parameters;

    this.component?.element.removeStyle('display')
      
    return this;
    
  }
  

  hide(): this {
      
    this.component?.element.style({ display: 'none' })
      
    return this;
    
  }

  refresh( parameters?: Partial<ComponentProps> | undefined ): this {
      
    // Mise à jour des paramètre
    this.#_parameters = UpdateObject<ComponentProps>( this.#_parameters, parameters )

    // Reconstruit le composant
    const render = this.render()

    // Remplacement basket
    this.component?.element.instance.parentNode?.replaceChild(

      render.element.instance,

      this.component?.element.instance
      
    )
      
    return this;
    
  }
  
  render(){
    
    this.#_component = this.componentConstructor( this.parameters )

    return this.#_component;
    
  }
  

}

export class AunStackViews<Scheme> implements IStackViews<Scheme>{

  /**
   * Les vues
   */
  get views(){ return this.#views }

  #views : IStackViewsList<Scheme> = {} as IStackViewsList<Scheme>;


  oldComponent : IWidget<any, any> | undefined = undefined;

  /**
   * Options
   */
  options : IStackViewsOptions<Scheme> = {} as IStackViewsOptions<Scheme>
  

  /**
   * Système de navigation
   */
  navigation: INavigation<Scheme> = new AunNavigation<Scheme>();
  

  emitter : IEmitter<IStackViewsEmitterScheme<Scheme>> = new AunEmitter<IStackViewsEmitterScheme<Scheme>>()
  

  constructor( 
    
    views : IStackViewsList<Scheme>, 
    
    options : IStackViewsOptions<Scheme>
    
  ){

    this.#views = views;

    this.options = options || {} as IStackViewsOptions<Scheme>;

    this.navigation.setOptions({

      middlewares: [
        
        this.#defaultMiddleware.bind( this ),

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


  #initializeCanvas(){

    fe( this.options.canvas, canvas => {
      
      canvas.style.position = 'relative';

    })
    
    return this;
    
  }
  

  middleware(callback: INavigationMiddlewareCallback<Scheme> ): this {

    this.navigation.options.middlewares?.push( callback )

    return this;
    
  }

  currentView() : IStackViewsList<Scheme>[keyof Scheme] | undefined{
    
    return this.#views[ this.navigation.currentRouteName() ];
    
  }

  oldView() : IStackViewsList<Scheme>[keyof Scheme] | undefined{

    const name = this.navigation.oldRouteName();

    return name ? this.#views[ name ] || undefined : undefined;
    
  }
  
  #defaultMiddleware( { args, routeName } : INavigationMiddlewareProps<Scheme> ) : this {

    const view : IStackViewsList<Scheme>[keyof Scheme] | undefined = this.#views[ routeName ] || undefined;

    if( view && this.options.canvas ){

      fe( this.options.canvas, canvas => {

        const component = view.componentConstructor(args);

        const transitionAvailable = view?.options.transitions && component.element.instance;

        const oldView = this.oldView();
        
        // const oldTransitionAvailable = oldView?.options.transitions && this.oldComponent?.element.instance;


        component.element.style({

          position: 'absolute',
          
          top:'0',
          
          left:'0',

          zIndex: '2'
          
        })


        if( this.oldComponent ){

          component.element.style({

            position: 'absolute',
            
            top:'0',
            
            left:'0',

            zIndex: '1'
            
          })
          
        }

        // const route = this.currentView();

        // console.log('Old routre', routeName, oldView )
        
        if( transitionAvailable ){

          component.element.on('transitionend', () =>{

          })
          
          view.options.transitions?.entry.in( component.element, () => {

            this.oldComponent?.element.remove()

            this.oldComponent = component;
            
          } )

          if( this.oldComponent ){

            oldView?.options.transitions?.entry.out( this.oldComponent.element, () => {} );
            
          }
          
          canvas.append( component.element.instance )

        }
        

        
        if( !transitionAvailable ){

          canvas.innerText = '';

          canvas.append( component.element.instance )

          this.oldComponent = component;

        }

        
        
      } )


    }

    else{

      this.emitter.dispatch('error', routeName )
      
    }
    
    return this;
    
  }
  
  /**
   * Démarrage
   */
  run(): this {

    this.navigation.observe()
    
    if( this.options.index ){

      this.navigation.navigate( 
        
        this.navigation.currentRouteName() || this.options.index,

        this.navigation.currentQuery() || undefined,

        undefined
        
      )

    }
    
    return this;
    
  }
  
  
}

/**
 * Système de navigation
 */
export class AunNavigation<Scheme> implements INavigation<Scheme>{

  options: INavigationOptions<Scheme> = {} as INavigationOptions<Scheme> 

  emitter: IEmitter<INavigationEmitterScheme<Scheme>> = new AunEmitter<INavigationEmitterScheme<Scheme>>()
  
  #oldRoute : keyof Scheme | undefined;
  
  constructor(){

    this.options.middlewares = this.options.middlewares || [];
    
  }

  currentRouteName() : keyof Scheme{

    return (this.options.useHashtagParser ? location.hash : location.pathname).substring(1) as keyof Scheme

  }

  oldRouteName() : keyof Scheme | undefined {

    return this.#oldRoute;

  }

  currentQuery<T>() : T | undefined{

    return URLParamsObject<T>( location.search );
    
  }

  setOption(optionName: keyof INavigationOptions<Scheme>, value: (INavigationMiddlewareCallback<Scheme>[] & boolean) | undefined ): this {
      
    this.options[ optionName ] = value;
    
    return this;
    
  }
  
  setOptions( options: INavigationOptions<Scheme> ): this {

    this.options = UpdateObject<INavigationOptions<Scheme>>( this.options, options )
      
    this.emitter.dispatch('options', this )
    
    return this;
    
  }

  middleware( middleware : INavigationMiddlewareCallback<Scheme> ): this {

    this.options.middlewares?.push( middleware )
      
    return this;
    
  }
  
  observe(): this {

    window.addEventListener( 'popstate' ,ev => this.dispatchNavigate( ev ) )

    this.capturesActions()
    
    return this;
    
  }

  capturesActions( ) : this {

    if( this.options.capture ){

      document.body.addEventListener('click', (ev) => {

        const target = this.parseElementCaptured( ev )
        

        if( target && !target.hasAttribute('navigate:no-detection') ){
          
          const url = target.getAttribute('href') || target.getAttribute('navigate:view') || target.getAttribute('navigate-view');
          
          const blank = (target.getAttribute('target') || '').toLowerCase() == '_blank';

          const external = url ? this.isExternalURL( url ) : false;
          

          if( url && !blank && !external ){

            ev.preventDefault();

            this.navigate( this.parseRouteName( url ) as keyof Scheme, {} as Scheme[keyof Scheme], ev )

          }
          
          
        }
        
      }, false )

    }

    return this;
    
  }

  parseRouteName( routeName : string ){

    const route = routeName.trim();

    const firstChar = route.substring(0, 1);

    return ( firstChar == '/' || firstChar == '#' ) ? route.substring(1) : route;
    
  }
  
  isExternalURL( url : string ){

    return ( url.match( /^http/gi ) || url.match( /^\/\//gi )) ? true : false;
    
  }
  
  parseElementCaptured( ev : Event ){

    if( ev.target instanceof HTMLElement ){

      if( ev.target.hasAttribute('navigate:view') || ev.target.tagName == "A" ){

        return ev.target;
        
      }

      else{

        return AscendingDOMPath<HTMLElement>( ev.target as HTMLElement, parent => 

          parent.tagName == 'A' || parent.hasAttribute('navigate:view') ? true : false
          
        )

      }

    }

    return undefined
    
  }
  
  dispatchNavigate( ev ?: Event | undefined ) : this {

    const routeName = this.currentRouteName();

    const parser = this.options.useHashtagParser ? 'hashtag' : 'directory';

    
    this.options.middlewares?.forEach( middleware => middleware( {

      navigation: this,

      event: ev,

      routeName: this.currentRouteName(),

      args: this.currentQuery() || undefined,

      parser: this.options.useHashtagParser ? 'hashtag' : 'directory',
      
    } ) )
  
    this.emitter.dispatch('navigate', { 
      
      navigation : this, 
      
      routeName, 

      parser: parser,
    
    })

    return this;
    
  }
  
  navigate( route : keyof Scheme, props ?: (Scheme[ keyof Scheme ]), ev?: Event ): this {

    if( !route ){ return this; }
    
    const currentRoute = this.currentRouteName();
    
    const routeName = route as string;
    
    this.#oldRoute = routeName as keyof Scheme;
    
    if( currentRoute != routeName ){

      if( this.options.useHashtagParser ){

        location.hash = `${ routeName }`;
        
      }

      else{

        history.pushState( props || {}, document.title, `${ routeName }`);

        this.dispatchNavigate( ev || undefined );
        
      }

    }

    else{ this.dispatchNavigate( ev || undefined ); }

    return this;
    
  }
  
}




/**
 * Transition des éléments
 */
export class AUNTransition implements ITransition{

  #props : ITransitionProps = {} as ITransitionProps;

  // emitter: IEmitter<ITransitionEmitterScheme> = new AunEmitter();

  constructor( props : ITransitionProps ){

    this.#props = props;
    
  }
  
  in( target : IAnimateTarget, doneCallback : ITransitionDoneCallback ): IAnimate {

    const animate =  this.#props.whenEntry( target );

    animate.emitter.listen('done', () =>{ doneCallback( this ) })
      
    return animate;
    
  }

  out( target : IAnimateTarget, doneCallback : ITransitionDoneCallback ): IAnimate {

    const animate = this.#props.whenExit( target );
      
    animate.emitter.listen('done', () =>{ doneCallback( this ) })

    return animate;
    
  }
  
}


/**
 * Transitions prédinies des éléments
 */
export class AUNTransitions{

  static fade = new AUNTransition({

    whenEntry: ( target ) => AUNAnimate.trigger( target, ({animate, target}) => {

      animate.element({

        target,
        
        from: [ 0 ],
  
        to: [ 100 ],

        duration: 1000,

        properties: ['opacity'],

        patterns: [

          (value) => `${ value / 100 }`,
          
        ]
  
      })

      return animate;

    }),

    whenExit: ( target ) => AUNAnimate.trigger( target, ({animate, target}) => {

      animate.element({

        target,
        
        from: [ 100 ],
  
        to: [ 0 ],

        duration: 1000,

        properties: ['opacity'],

        patterns: [

          (value) => `${ value / 100 }`,
          
        ]
  
      })

      return animate;

    }),
    
  })
  

  static horizontalSlide = new AUNTransition({

    whenEntry: ( target ) => AUNAnimate.trigger( target, ({animate, target}) => {

      animate.element({

        target,
        
        from: [ 100 ],
  
        to: [ 0 ],

        duration: 1000,

        properties: ['transform'],

        patterns: [

          (value) => `translateX(-${ value }%)`,
          
        ]
  
      })

      return animate;

    }),

    whenExit: ( target ) => AUNAnimate.trigger( target, ({animate, target}) => {

      animate.element({

        target,
        
        from: [ 0 ],
  
        to: [ 100 ],

        duration: 1000,

        properties: ['transform'],

        patterns: [

          (value) => `translateX(-${ value }%)`,
          
        ]
  
      })

      return animate;

    }),
    
  })
  
}

/**
 * Animation des éléments
 */
export class AUNAnimate implements IAnimate{

  #target: IAnimateTarget;

  #callback : IAnimateCallback;



  options: IAnimateOptions = {} as IAnimateOptions;

  #originOptions: IAnimateOptions = {} as IAnimateOptions;

  get defaultFrame() : number{ return 60 }

  interpolarities : IAnimateInterpolarities = [];

  state : number = 0;

  loopState : number = 0;

  status : boolean = false;

  emitter : IEmitter<IAnimateEmitterScheme> = new AunEmitter()

  
  
  constructor( target : IAnimateTarget, callback : IAnimateCallback ){

    this.#target = target;

    this.#callback = callback;
    
  }

  clean(): this {

    this.options = this.#originOptions;
    
    return this;

  }


  /**
   * Anime un élément
   */
  element(options: IAnimateElementOptions): this {

    const properties : IAnimateElementProperties = options.properties || ['opacity'];

    const originalTransition = options.target.instance.style.getPropertyValue('transition') || null

    const patterns = options.patterns || [ (v) => `${ v / 100 }` ]

    options.target.instance.style.transition = `${ properties.join(', ') } 100ms linear`
  

    this.create({

      duration : options.duration || 500,

      from : options.from || [0],
  
      to : options.to || [100],

      // start(){ },
      
      hit: ({ interpolarity }) => {

        // console.log('Animae element', interpolarity )

        interpolarity.forEach( (value, k) => {

          const property = (properties[ k ] || undefined) as string | undefined;

          if( property ){

            const style : { [ K : string ] : string } = {};

            const pattern = patterns[ k ] || null;

            style[ property ] = pattern ? `${ pattern( value ) }` : `${ value }`

            options.target.style( style );
            
          }
          
        })

      },

      done(engine) {
          
        engine.clean()

        if( originalTransition ){ options.target.style({ transition: originalTransition }) }

        else{ 

          setTimeout(()=> options.target.removeStyle('transition'), 100 )
          
        }
        
      },
      
    })
    

    return this;
    
  }

  

  /**
   * Remake the animation with new options
   */
  reset( options: IAnimateOptions ){

    this.options = Object.assign({}, this.options, options);

    return this.restart();
    
  }


  create( options : IAnimateOptions ){

    this.options = options;

    this.#originOptions = options;

    /**
     * Initialize
     */
    const interpolarities: IAnimateInterpolarities = []

    const frame = this.options.duration / (this.options.frame || (this.defaultFrame || 60))

    /**
     * Prepares
     */
    this.options.from.map((v,k)=>{

        const delta = (Math.abs( this.options.to[k] - v ) / frame);

        const sens = this.options.to[k] > v;

        let from = v;

        let to = sens ? this.options.to[k] + delta : this.options.to[k] - delta;
        

        interpolarities[k] = []

        if(sens){

            for (let x = from; x <= to; x+=delta) { interpolarities[k][interpolarities[k].length] = x >= this.options.to[k] ? this.options.to[k] : x; }

        }

        else{

            for (let x = from; x >= to; x-=delta) { interpolarities[k][interpolarities[k].length] = (x <= this.options.to[k]) ? this.options.to[k] : x; }
            
        }
        
    })
    
    this.emitter.dispatch('ready', interpolarities)

    /**
     * Trigger Engine
     */

    this.status = true;

    this.interpolarities = interpolarities;

    if(typeof this.options.start == 'function'){ this.options.start(this); }

    this.emitter.dispatch('start', interpolarities[0])


    return this;
    
  }


  /**
   * Stopper 
   */
  stop(){

    this.status = false;

    // this.emitter.dispatch('stop', this)

    return this;

  }


  /**
   * Redemarrage de l'animation
   */
  restart(){

    this.status = false;

    this.state = 0;

    this.loopState = 0;
    
    return this.create( this.options );
    
  }


  /**
   * Lecture de l'animation
   */
  play(){

      if(this.status === false){ return this; }

      const loop = this.options.loop === true ? true : this.options.loop;

      const interpolarities = this.interpolarities;


      if(!interpolarities.length){ throw (`Sensen.Fx.Engine : No Interpolarity Data < ${ JSON.stringify(interpolarities) } >`); }

      const limit = interpolarities[0].length - 1;

      const couple : number[] = interpolarities.map(entry=> entry[ this.state ] )

      const percent = (this.state / limit) * 100;

      if(this.state >= limit){

          if(typeof this.options.hit == 'function'){

              this.options.hit({

                interpolarity : interpolarities.map(entry=> entry[limit]), 
                
                animate: this, 
                
                percent
                
              });

          }

          if(typeof this.options.done == 'function'){ this.options.done(this); }
          
          this.emitter.dispatch('done', interpolarities[ interpolarities.length - 1 ])


          /**
           * Loop
           */
          if(loop && (typeof loop == 'number' && loop <= this.loopState) ){
  
              this.state = 0;
              
              this.loopState++;
              
              this.emitter.dispatch('loop', this)

              globalThis.requestAnimationFrame(this.play.bind(this));

          }
          
      }

      else{

          this.state++;

          if(typeof this.options.hit == 'function'){

              this.options.hit({
                
                interpolarity : couple, 
                
                animate : this, 
                
                percent
              
              });

          }
          
          this.emitter.dispatch('hit', {
              
              interpolate : couple,
              
              engine : this,
              
              percent

          })

          globalThis.requestAnimationFrame(this.play.bind(this))

      }

      return this;
      
  }
  
  #initCallback(){

    this.#callback({

      animate: this,
      
      target: this.#target,
      
    })

    return this;
    
  }
  
  static trigger( target : IAnimateTarget, callback : IAnimateCallback ){

    return (new this( target, callback )).#initCallback().play()

  }
  
}
