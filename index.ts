
import CoreAppearance from "@protorians/core/appearance";
import { 
  AunConstruct,
  AunElement,
  AunState, 
  AunWidget,
  AunView,
  AunStackViews
} from "./foundations";

import { 
  AUNWindow, 
  IAttributesMap, 
  IChildren, 
  IComponentConstructor, 
  IHydrateComponent, 
  IKitProps, 
  IImageProps, 
  INode, 
  IStackViewsList, 
  IStackViewsOptions, 
  IState, 
  IViewOptions, 
  IWidget, 
  IWidgetAsyncCallback, 
  IWProps, 
  IWTarget, 
  ITextProps,
  IWidgetProps
} from "./types";


const aunWindow : AUNWindow = { ...window }

aunWindow.AUNRC = aunWindow.AUNRC || {}
  


/**
 * CreateState
 * @description Instance fonctionnelle d'usage de gestion des états AUN
 * @param state Valeur par default de l'état
 * @example CreateState<StateType>( stateValue )
 */
export function CreateState<S extends IState>( state : S ){

  return new AunState<S>( state );
  
}


/**
 * DropComponent
 * @param target Balise HTML cible où deposer le composant. La valeur peut être un Element HTML ou une requete de selecteur
 * @param component Composant à deposer
 * @description Lier un composant à une cicle 
 * @example DropComponent<PropsType>( '#root', Component( { ... } ) )
 * DropComponent<PropsType>( document.getElementById('root'), Component( { ... } ) )
 */
export function DropComponent<P extends IWProps, E extends INode>( 
  
  component : IWidget<P, E>,
  
  target : INode,
  
){

  target.append( component.element.instance )

  return component
  
}


/**
 * DropComponents
 * @description Lier plusieurs composants à plusieurs cicles.
 * @param targets Balises HTML cible où deposer le composant. La valeur peut être un Element HTML ou une requete de selecteur. Instancie plusieurs cicle à la fois.
 * @param component Composant à deposer dans l'élément HTML
 * @example DropComponents<PropsType, HTMLDivElement>( '.drop-target', ( props : Props ) => ... )
 */
export function DropComponents<P extends IWProps, E extends INode>( 
  
  component : IWidget<P, E>,
  
  targets : NodeListOf<INode>,
  
){

  targets.forEach( target => DropComponent( component, target ) )

  return component;

}


// /**
//  * InstantiateComponent
//  * @description Instancier un composant. Cela permet de garder l'instance courante du composant avec les propriétés définies. À utiliser dans les cas l'IDE n'arrive pas typer correctement les variables.
//  * @param component Composant cible
//  * @example InstantiateComponent( component( props ) )
//  */
// export function InstantiateComponent( component : IWidget<any, any> ){ return component; }


/**
 * AsyncComponent
 * @description Utiliser un composant avec une promesse. Composant bloquant en attendant le traitement. Il peut être ajouter aux enfants d'un widget
 * @param callback Fonction de renvoie pour le traitement d'un promesse. Puis renvoyer un composant instancié 
 * @example AsyncComponent( ( resolve, reject ) => {
 *    setTimeout( () => resolve( component() ), 3000 )
 * })
 */
export async function AsyncComponent<P extends IWProps, E extends INode>( callback : IWidgetAsyncCallback ) : Promise<IWidget<P,E>>{

  return (new Promise<IWidget<any, any>>( callback ))
  
}


/**
 * UseComponent
 * @description Utiliser un composant dans une / plusieurs cibles
 * @param target Balises HTML cible où deposer le composant. La valeur peut être un Element HTML ou une requete de selecteur. Instancie plusieurs cicle à la fois.
 * @param component Composant instancié
 * @example UseComponent<PropsType>( '#root', component( props ) ) // Requête de selecteur pour la cible
 * UseComponent<PropsType>( document.getElementById('root'), component( props ) ) // Instance de type HTMLElement pour la cible
 */
export function UseComponent<P extends IWProps, E extends INode>( 
  
  component : IWidget<any, any>,
  
  target : IWTarget,
  
){

  if( typeof target == 'string' ){

    DropComponents<P, E>( component, document.querySelectorAll( target ) )
    
  }

  else if( target instanceof NodeList ){

    DropComponents<P, E>( component, target )
    
  }

  else if ( target instanceof HTMLElement ){

    DropComponent<P, E>( component, target )

  }

  else if( target instanceof AunElement ){

    DropComponent<P, E>( component, target.instance )
 
  }

  return component as IWidget<P, E>;
  
}


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
export function CreateKit( definition : IKitProps ){
  
  return <P extends IWProps, E extends INode>( p : P ) => 

    (definition.component( p ) as IWidget<P,E>)
    
      .manipulate( element => element.classname( 
        
        (new CoreAppearance()).sheet( definition.appearance ).mount().uid 
        
      ) )
    
  ;
  
}


/**
 * aune — AUN Virtual Element
 * @description Instance fonctionnelle d'usage des éléments AUN
 * @param tagname Nom de la balise HTML
 * @example aun<HTMLSpanElement>( 'span' )
 */
export function aune<E extends INode>( tagname : string ){

  return (new AunElement<E>( tagname ))
  
}


/**
 * RawWidget
 * @description Instance fonctionnelle d'usage des Widgets AUN
 * @param tagname Nom de la balise HTML
 * @param props Propriétés du widget
 * @example RawWidget<PropsType, HTMLSpanElement>( 'span', props )
 */
export function RawWidget<P extends IWProps, E extends INode>( tagname : string, props : P ){

  const widget = (new AunWidget<P, E>( tagname, props ))
  
  widget.emitter.dispatch( 'beforeRendering', widget );

  widget.render();

  widget.emitter.dispatch( 'afterRendering', widget );

  return widget;

}


/**
 * Widget
 * @description Créer une couche de calque
 * @param props Propriétés du widget. La propriété `child` représente les enfants du widget (contenu)
 * @example Widget<PropsType>({
 * child: ...
 * otherProp: ...
 * })
 */
export function Widget( props : IWidgetProps ) : AunWidget<IWidgetProps, HTMLDivElement>{

  return RawWidget<IWidgetProps, HTMLDivElement>( 'div', props );
  
}


/**
 * Textual
 * @description Calque destiné aux textes
 * @param props Propriétés du widget. La propriété `child` représente contenu de type string
 * @example Textual<PropsType>({
 * child: ...
 * otherProp: ...
 * })
 */
export function TextWidget( props : ITextProps ) : AunWidget<ITextProps, HTMLSpanElement>{

  return RawWidget<ITextProps, HTMLSpanElement>( 'span', props )
  
}


/**
 * Image
 * @description Calque aus images
 * @param props Propriétés du widget.
 * @example ImageWidget<PropsType>({
 * src: ...
 * })
 */
export function ImageWidget( props : IImageProps ) : AunWidget<IImageProps, HTMLImageElement>{

  return RawWidget<IImageProps, HTMLImageElement>( 'img', props )

    .manipulate( e => {

      Object.entries( props ).forEach( ({ 0: name, 1: value }) => {

        if( name == 'mode'){ return ; }

        const attr : IAttributesMap = {};

        attr[ name ] = value;

        e.attribute( attr );
        
      });

      if( props.mode ){

        e.style({ objectFit: props.mode || '' });
        
      }
      
    })
  
  ;
  
}



export function View<C extends IWProps>( component : IComponentConstructor, options ?: IViewOptions<C> | undefined  ){

  return new AunView<C>( component, options )
  
}

export function CreateStackViews<Scheme>( 
  
  views : IStackViewsList<Scheme>, 
  
  options : IStackViewsOptions<Scheme> = {}
  
){

  return new AunStackViews<Scheme>( views, options )
  
}


// export function ModalWidget(){}


// export function SheetWidget(){}


// export function ActionSheetWidget(){}


// export function ListSheetWidget(){}


// export function DroplistWidget(){}


// export function ButtonWidget(){}


// export function ImageWidget(){}


// export function ScrollWidget(){}


// export function FormWidget(){}


// export function InputWidget(){}




/**
 * AUN Construct
 * @description Construire un composant à partir des enfants
 * @param component Composant cible
 * @param child Enfant à injecter
 * @example Construct<ComponentType>( component, child )
 * Construct( component, child )
 */
export function Construct<Component extends IWidget<IWProps, INode>>( 
  
  component : Component, 
  
  child : IChildren
  
){ return ( new AunConstruct() ).make( component, child ) }



/**
 * CreateComponent
 * @description Créer un composant en ajoutant immédiatement à la fil d'attente hydratation tout en permetant de l'exporter avec un nom d'emprunt. 
 * @param name 
 * @param widgetConstructor 
 * @example export const HelloWord = CreateComponent<PropType>('HelloWorld', ( props : IWProps ) => ... )
 */
export function CreateComponent<P extends IWProps>( 
  
  name : string, 
  
  widgetConstructor : IHydrateComponent<any, HTMLElement> 
  
) : IHydrateComponent<P, HTMLElement> {

  if( !( aunWindow.AUNHW instanceof MutationObserver ) ){

    ActiveAutoHydrateComponents()

  }
  
  HydrateComponentQueue<P>( name, widgetConstructor )

  return widgetConstructor
  
}



/**
 * HydrateComponentQueue
 * @description Fil d'attente des hydration des composants AUN
 * @param name CNom du composant. Sensible à la case
 * @param widgetConstructor Constructeur du composant AUN
 * @example HydrateComponentQueue<WidgetPropsType>( 'ComponentName', ( props : WidgetProps ) => ... )
 */
export function HydrateComponentQueue<P extends IWProps>( 
  
  name : string, 
  
  widgetConstructor : IHydrateComponent<any, HTMLElement> 
  
){

  if( aunWindow.AUNRC ) {

    aunWindow.AUNRC[ (name).toUpperCase() ] = widgetConstructor
    
  }

  HydrateComponent<P>( name, widgetConstructor )

  return widgetConstructor;
  
}


/**
 * HydrateComponent
 * @param name Chaine de caratère représentant le nom du composant. Sensible à la case
 * @param widgetConstructor Constructeur du composant AUN
 * @example HydrateComponent<PropsType>( 'Hello', HelloComponent )
 */
export function HydrateComponent<P extends IWProps>( 
  
  name : string, 
  
  widgetConstructor : IHydrateComponent<any, HTMLElement> 
  
){

  const refs = document.querySelectorAll<Element>(`${ name }`)

  /**
   * Références liste
   */
  refs.forEach( ref => {

    /**
     * Extraction des props
     */
    const props = ExtractProps<P>( ref.attributes )

    props.child = ref.innerHTML || undefined;
    
    /**
     * Mise en place du composant
     */
    const widget = widgetConstructor( props )

    /**
     * Remplacement
     */
    ref.parentNode?.replaceChild( widget.element.instance, ref )
    
  })

  
  return widgetConstructor;

}

/**
 * ExtractProps
 * @description Extraction des propriétés dans le constructeur d'un composant
 * @param attributes Contenu de la propriété "HTMLElement.attributes"
 * @example ExtractProps<PropsType>( element.attributes )
 */
export function ExtractProps<P extends IWProps>( attributes : NamedNodeMap ) : P{

  const props : P = {} as P

  Object.values( attributes ).forEach( attribute => {
    
      props[ attribute.name as keyof P ] = attribute.value as P[ keyof P ]
      
  })
  
  return props;
  
}



/**
 * ActiveAutoHydrateComponents
 * @description Active l'hydratation automatique des composants
 * @example ActiveAutoHydrateComponents()
 */
export function ActiveAutoHydrateComponents(){

  aunWindow.AUNHW = aunWindow.AUNHW || new MutationObserver( mutations => {

    const storeKeys = Object.keys( aunWindow.AUNRC || {} )

    mutations.forEach( mutation => {
      
      if( 
        
        mutation.type == 'childList' && 
        
        mutation.target instanceof HTMLElement

      ){

        mutation.addedNodes.forEach( target => {

          if( target instanceof HTMLElement && storeKeys.includes( target.tagName.toUpperCase() ) ){

            HydrateComponent( target.tagName, (aunWindow.AUNRC || {})[ target.tagName ] )

          }
          
        })

      }
      
    })
    
  })

  aunWindow.AUNHW.observe( document.body, {
    
    subtree: true,

    childList: true,

  })

  return aunWindow.AUNHW;
  
}




/**
 * AUN
 * @description Exportations des fonctionnalités de base du framework 
 */
export default class AUN { 

  /**
   * aune — AUN Virtual Element
   * @alias aune
   * @description Instance fonctionnelle d'usage des éléments AUN
   */
  static Element = aune;

  /**
   * RawWidget
   * @alias RawWidget
   * @description Instance fonctionnelle d'usage des Widgets AUN
   */
  static RawWidget = RawWidget;

  /**
   * Construct
   * @alias Construct
   * @description Construire un composant via AunConstruct
   */
  static Construct = Construct;

  /**
   * Widget
   * @alias Widget
   * @description Créer une couche de calque
   */
  static Widget = Widget;

  /**
   * Textual
   * @alias TextWidget
   * @description Calque destiné aux textes
   */
  static Textual = TextWidget;
  
  /**
   * CreateState
   * @description Instance fonctionnelle d'usage de gestion des états AUN
   */
  static CreateState = CreateState;

  /**
   * DropComponent
   * @description Lier un composant à une cicle 
   */
  static DropComponent = DropComponent;

  /**
   * DropComponents
   * @description Lier plusieurs composants à plusieurs cicles 
   */
  static DropComponents = DropComponents;

  // /**
  //  * InstantiateComponent
  //  * @description Instancier un composant. Cela permet de garder l'instance courante du composant avec les propriétés définies
  //  */
  // static InstantiateComponent = InstantiateComponent;

  /**
   * AsyncComponent
   * @description Utiliser un composant avec une promesse. Composant bloquant en attendant le traitement. 
   */
  static AsyncComponent = AsyncComponent;

  /**
   * UseComponent
   * @description Utiliser un composant dans une / plusieurs cibles
   */
  static UseComponent = UseComponent;
  

}


