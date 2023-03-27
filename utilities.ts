'use-struct';

import { IAttributesMap, IAttributesMapValues, IObjectToString } from "./types";

/**
 * URLParamsObject
 * @param searchParams Chaine de caractère des paramètres
 */
export function URLParamsObject<T>( searchParams : string ){

  if( searchParams ){
  
    searchParams = searchParams.trim()

    const out : T = {} as T;

    const f = searchParams.substring(0,1);

    (f == '?' ? searchParams.substring(1) : searchParams ).split('&').forEach( param => {

      const eq = param.split('=')

      const name = eq[0] as keyof T;

      if( name != 'children' ){

        out[ name ] = (eq[1]) as any

      }
      
    })

    return out;  
  
  }
    
  return undefined;
  
}


/**
 * BrowseDOMPath
 * @description Parcour l'arbre de parent d'un element. Une fonction de validation peut stopper le parcour en retournant true. Chaque parent parcourut est renvoyer via la fonction de validation 
 * @param child Element à parcourir
 * @param validator Fonction de validation
 * @example
 * BrowseDOMPath( element, ( parent ) => ... )
 */
export function AscendingDOMPath<T extends Node | HTMLElement>(
    
  child : T, 
  
  validator : (parent : T) => boolean
  
){
  
  let node = child.parentElement;

  while (node != null) {
 
    if (validator( node as T ) === true) { return node as T; }

    node = node.parentElement;
 
  }

  return undefined;

}



/**
 * UpdateObject
 * @description Mise à jour d'un objet à partir d'un autre objet
 * @param originalObject Object original
 * @param parameters À injecter
 */
export function UpdateObject<T>( 
  
  originalObject : T,
  
  parameters?: Partial<T> | undefined 
  
){

  if( parameters ){

    Object.entries( parameters ).forEach( ({0: name, 1: parameter}) => 
      
      originalObject[ name as keyof T ] = parameter as T[ keyof T ]
      
    )

  }

  return originalObject;

}


/**
 * AttributesValuesAunrser
 * @description Analyse et donne la valeur en fonction du type
 * @param value Valeur de l'attribute
 * @example AttributesValuesAunrser( data )
 */
export function AttributesValuesAunrser( value : IAttributesMapValues ){

  let parsed = value;

  if( typeof value == 'object' && value ){

      parsed = JSON.stringify( value )
      
  }

  return parsed;
  
}



/**
 * AttributesObject
 * @param attributes Charge utile
 * @param ns nom de l'espace — `ui:button="success"`
 * @param separator Chaine de caratère entre le nom d'espace et le nom de l'attribut
 */
export function AttributesObject<T extends IAttributesMap>( 

attributes : IAttributesMap, 

ns ?: string | undefined,

separator ?: string | undefined
  
) : T{

  const nms = ( typeof ns != 'undefined' ? `${ ns }${ separator || '-'}` : '' );

  let output : T = {} as T
  

  Object.entries( attributes ).map( ({ 0 : name, 1 : value }) => {

      if( typeof value == 'object' && value ){

        if( Array.isArray( value ) ){

          const k = `${ nms }${ name }` as keyof T

          output[ k ] = `${ AttributesValuesAunrser( value ) }` as T[ keyof T ];
        
        }

        else{

          output =  {
              
              ...output, 
              
              ...AttributesObject( value , `${ nms }${ name }`, separator ) 

          }

        }
        
      }

      else if( typeof value != 'undefined' ){

        const k = `${ nms }${ name }`

        output[ k as keyof T ] = `${ AttributesValuesAunrser( value ) }` as T[ keyof T ];
        
      }
      
  })
  
  return output;
  
}



export function ObjectToString( payload : object, c ?: IObjectToString ){

  c = c || {};

  return Object.entries( payload )
  
    .map( ({ 0: name, 1: value }) => 
    
      `${ c?.start || '' }${ name }${ c?.eq || ':' }${ value }${ c?.end || '' }` 
      
    )

    .join( c?.joiner || '' )

}



/**
 * SafeText
 * @description Désactiver les crochets et quotes dans du texte
 */
export function safeText( text : string ){

  return text

    .replace(/&/g, '&amp;')

    .replace(/'/g, '&apos;')

    .replace(/"/g, '&quot;')

    .replace(/>/g, '&gt;')

    .replace(/</g, '&lt;')
    
}


/**
 * SafeText
 * @description Activer les crochets et quotes dans du texte
 */
export function unSafeText( text : string ){

  return text

    .replace(/&amp/g, '&')

    .replace(/&apos/g, "'")

    .replace(/&quot/g, '"')

    .replace(/&gt/g, '>')

    .replace(/&lt/g, '<')
    
}


/**
 * addSlashes
 * @description Désactiver les crochets et quotes dans du texte
 */
export function AddSlashes( text : string ){

  return text.replace( new RegExp("'", 'g'), "\\'")
    
}


/**
 * stripSlashes
 * @description Désactiver les crochets et quotes dans du texte
 */
export function StripSlashes( text : string ){

  return text.replace( new RegExp("\\'", 'g'), "'")
    
}



/**
 * uncamelize
 */
export function UnCamelize( value : string ){

  return value.replace( /([A-Z])/g, `-$&`).toLowerCase();

}


/**
 * camelize
 */
export function Camelize( value : string ){

  return value.replace( /(?:^\w|[A-Z]|\b\w)/g, (text, index) =>

    index === 0 ? text.toLowerCase() : text.toUpperCase()
    
  ).replace( /\s+/g, '' );

}
