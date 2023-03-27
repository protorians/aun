
import { 
  AUNTransitions
} from "./foundations";

import { 
  ActiveAutoHydrateComponents, 
  AsyncComponent, 
  CreateComponent, 
  CreateState, 
  HydrateComponentQueue, 
  aune, 
  TextWidget, 
  UseComponent, 
  CreateKit, 
  Widget, 
  View,
  CreateStackViews,
} from "./index";
import type { IWProps } from "./types";

ActiveAutoHydrateComponents()

/**
 * Typing
 */
interface IHelloProps extends IWProps {
  name : string
}


/**
 * Create State
 */
const stateObject = CreateState<{status: boolean}>( { status : false} )

const helloState = CreateState<boolean>( false )
  .catch( payload => console.log( 'State Error', payload ) )




/**
 * Modify state
 */
setInterval(()=> helloState.set( !helloState.value ), 1000)

setInterval(()=> {
  stateObject.set( { status: !stateObject.value.status } );
}, 2000)




/**
 * Create component
 */

const World = (( props : IHelloProps ) => Widget({
  children: `SensenProtorian is ready : ${ props.name }`
}))


const Hello = ( props : IHelloProps ) => Widget({

  children: [

    helloState.use( state => 
      
      TextWidget({ 
        
        children: ( state ? `State : ${ props.name }` : 'No State' ) 
      
      }) 

    ),

    stateObject.use( state => 

      Widget({ children: ( state.status ? `StateObject : ${ state.status }` : 'No StateObject' ) }) 
      
    ),

    AsyncComponent( ( resolve ) => setTimeout( ()=> resolve( World({ name : 'Syana' }) ) , 2000 ) ),

    Widget({

      children: TextWidget({ children: ("Deep") }).appear({
     
        color: "#242424",
     
        fontSize: "24px"
     
      })

    }),
      
    TextWidget({ children: ("Welcome") }).appear({
  
      color: "#999",
 
      // padding: "12px"
 
    }).layer( element => element.on('click', ( data ) => console.log( data ) ) ),

    Widget({
  
      children: '<Hello name="In Hello Component"></Hello>'
  
    }).ready( widget => console.warn('Ready', widget.element.instance.parentNode ) ),

    Widget({
      children: '<TestComponent name="In Hello Component"></TestComponent>'
    }),
    
  ]
})




/**
 * Use component
 */

UseComponent( Hello({ name: 'IanCarter' }), '#root' ) 

// OR
// const HelloInstance = InstantiateComponent( Hello({ name: 'IanCarter' }) ) 
// UseComponent( '#root', HelloInstance )



/**
 * Hydrate component
 */
HydrateComponentQueue('TestComponent', World )

CreateComponent<IHelloProps>('Hello', ( props : IHelloProps) => Widget({

  children: `$> ${ props.name }`

}))




/**
 * Dynamic Hydratation Component
 */
setTimeout(()=>{

  const testes = document.querySelector('#testes')

  if( testes ){

    testes.innerHTML = `<TestComponent name="Component With intervals" class="dix" ></TestComponent>`

  }

}, 5000)




/**
 * Attributes & Aun Element instance
 */
const attribElement = aune<HTMLDivElement>('div')

attribElement.attribute({
  ui:{
    button: 'success'
  }
}, '', ':')

document.body.append( attribElement.instance )



// const myAppear = Appearance([

//   AppearanceFeature('@media screen (min-width : 960px)', {
//     '.abc':{
//       fontSize: '3vmin'
//     },
//   }),
  
//   AppearanceFeature('@layer DEF', {}),

// ])


/**
 * Kit Example
 */
const mykit = CreateKit({

  appearance: {

    '&':{
      backgroundColor:'#cacaca',
      // width:'100%',
      // height:'100px'
      margin: '4rem'
    },

    '&>.box':{
      color: '#777',
      fontSize: '18px',
      paddingVertical: '1rem',
      paddingHorizontal: '1.5rem',
    }
  },

  component : ( props : IHelloProps ) => Widget({
    children: Widget({
      children: `$> ${ props.name }`
    }).layer( e => e.className('box') )
    
  })


})

UseComponent( mykit<IHelloProps, HTMLElement>({ name: 'Use Kit' }), 'body' )




/**
 * View Example
 */
const HomeFrameComponent = () => Widget({

  children: [

    TextWidget({

      children: 'Home Frame'
      
    }).layer( element => 

      element.style({

        fontSize: '3vmin'
        
      }).attributeNS( { navigate:{ view : 'about' } }, undefined )
      
    ),
    
    TextWidget({

      children: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed ipsum explicabo modi, voluptates possimus ducimus excepturi optio consequuntur reiciendis quod quisquam ex, error autem suscipit, enim nisi aliquid sunt impedit?'
      
    }),
    
  ]
  
}).layer( e => e.style({ backgroundColor: 'white'}));

const AboutFrameComponent = () => Widget({

  children: [

    TextWidget({

      children: 'About Frame'
      
    }).layer( element => 

      element.style({

        fontSize: '5vmin'
        
      })
      
    ),
    
    // TextWidget({

    //   children: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed ipsum explicabo modi, voluptates possimus ducimus excepturi optio consequuntur reiciendis quod quisquam ex, error autem suscipit, enim nisi aliquid sunt impedit?'
      
    // }),
    
  ]
  
}).layer( e => e.style({ backgroundColor: 'white'}))



interface IAppStackViewsScheme{

  home: undefined;

  about: undefined;
  
}

const HomeFrame = View( HomeFrameComponent, { 

  title: 'Home Frame',

  name: 'home',

  transitions: {
    
    entry: AUNTransitions.horizontalSlide,

    exit: AUNTransitions.fade,
    
  },

  emitters:{

    // shown: ( {component, route } ) => console.log(route.name, 'is open') 

  }

} );


const AboutFrame = View( AboutFrameComponent, { 

  title: 'About Frame',

  name: 'about',

  presenter: 'modal',

  transitions: {

    entry: AUNTransitions.horizontalSlide,

    exit: AUNTransitions.fade,
    
  },

  emitters:{

    // shown: ( {component, route } ) => console.log(route.name, 'is open') 

  }

});


const AppStackView = CreateStackViews<IAppStackViewsScheme>({

  home: HomeFrame,

  about: AboutFrame,
  
}, {

  index: 'home',

  canvas: '#stackframes',

  useHashtagParser: false,

  middlewares:[

    // ( payload ) => {

    //   // console.log('My Middleware from option', payload )
      
    // }
    
  ]
  
});

// AppStackView.middleware( payload => console.log('Middle from middleware\'s method', payload ) )

AppStackView.run()



// AppStackView.navigation.navigate('home')