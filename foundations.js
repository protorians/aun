var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _AunElement_widget, _AunState_instances, _AunState_mirror, _AunState_recorded, _AunState_current, _AunState_emitters, _AunWidget_instances, _AunWidget__props, _AunWidget_excavation, _AunView__parameters, _AunView__component, _AunStackViews_instances, _AunStackViews_views, _AunStackViews_current, _AunStackViews_initializeCanvas, _AunStackViews_getOldView, _AunStackViews_createViewProps, _AunStackViews_defaultMiddleware;
import EventDispatcher from "@protorians/core/event-dispatcher";
import { AttributesObject, UpdateObject } from "@protorians/core/utilities";
import { Navigation } from "@protorians/core/navigation";
import CoreAppearance from "@protorians/core/appearance";
/**
 * findElement — Find Element
 * @param find Recherché
 * @param callback Fonction de rappel contenant l'element html en argument
 */
export function findElement(find, callback) {
    const fn = callback || new Function();
    let target = undefined;
    if (find) {
        if (typeof find == 'string') {
            target = document.querySelectorAll(find);
            target.forEach(element => fn(element));
        }
        else if (find instanceof NodeList) {
            target = find;
            target.forEach(element => fn(element));
        }
        else if (find instanceof HTMLElement) {
            target = find;
            fn(target);
        }
        else if (find instanceof AunElement) {
            target = find.instance;
            fn(target);
        }
    }
    return target;
}
/**
 * AUN Element
 * @description Encapscule l'lement HTML pour un usage optimal
 * @example AunElement<HTMLDivElement>('div')
 */
export class AunElement {
    /**
     * Widget associé
     */
    get widget() { return __classPrivateFieldGet(this, _AunElement_widget, "f"); }
    constructor(tagname) {
        /**
         * Emetteur
         */
        this.emitter = new EventDispatcher();
        _AunElement_widget.set(this, undefined);
        this.instance = document.createElement(tagname);
    }
    /**
     * own
     * @description Définit le widget propriétaire de l'élément
     * @param widget Widget Cible
     * @example element.own( widget )
     */
    own(widget) {
        __classPrivateFieldSet(this, _AunElement_widget, widget, "f");
        this.emitter.dispatch('own', widget);
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
        this.emitter.dispatch('measure', data);
        return data;
    }
    /**
     * measure
     * @description Execute asyncMeasure mais avec un callback
     * @param callback Fonction de rappel retournant la valeur en argument
     * @example element.measure( measure => ... )
     */
    measure(callback) {
        callback(this.asyncMeasure());
        return this;
    }
    /**
     * clean
     * @description Nettoie le contenu de l'instance de l'élément
     * @example element.clean()
     */
    clean() {
        Object.values(this.instance.children).forEach(children => children.remove());
        this.emitter.dispatch('clean', undefined);
        return this;
    }
    /**
     * remove
     * @description Supprime l'élément
     * @example element.remove()
     */
    remove() {
        this.instance.remove();
        this.emitter.dispatch('remove', undefined);
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
        this.emitter.dispatch('offset', data);
        return data;
    }
    /**
     * offset
     * @description Exécute `asyncOffset` mais avec une fonction de rappel.
     * Ceci permet d'enchaine avec une autre methode
     * @param callback Fonction de rappel retournant la valeur en argument
     * @example element.offset( offset => ... )
     */
    offset(callback) {
        callback(this.asyncOffset());
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
    content(child) {
        if (typeof child != 'undefined') {
            this.widget?.construct.make(this.widget, child);
            this.emitter.dispatch('content', child);
            return this;
        }
        return this.widget?.child;
    }
    /**
     * html
     * @description Définit un contenu HTML dans l'élément
     * @param data Contenu HTML
     * @example
     * element.html( 'string' )
     */
    html(data) {
        if (typeof data != 'undefined') {
            this.instance.innerHTML = data;
            this.emitter.dispatch('html', data);
            return this;
        }
        return this.instance.innerHTML;
    }
    /**
     * append
     * @description Ajout un noeud ou une chaine de caratère à l'élément
     * @param nodes Noeud ou chaine de caratère
     * @example
     * element.append( 'string' )
     * element.append( document.querySelector('.box') )
     */
    append(...nodes) {
        if (nodes) {
            nodes.forEach(node => this.instance.append(node));
            this.emitter.dispatch('append', nodes);
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
    listen(type, callback) {
        this.emitter.listen(type, callback);
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
    on(type, callback, options) {
        this.instance.addEventListener(type, callback, options);
        this.emitter.dispatch('on', { type, callback, options });
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
    style(properties) {
        if (properties) {
            Object.entries(properties).forEach(({ 0: name, 1: value }) => {
                this.instance.style[name] = `${value}`;
            });
            this.emitter.dispatch('style', properties);
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
    removeStyle(properties) {
        if (Array.isArray(properties)) {
            properties.forEach(name => {
                this.instance.style.removeProperty(name);
            });
            this.emitter.dispatch('removeStyle', properties);
        }
        else if (typeof properties == 'string') {
            this.instance.style.removeProperty(properties);
            this.emitter.dispatch('removeStyle', properties);
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
    toggleClassname(tokens) {
        if (Array.isArray(tokens)) {
            tokens.forEach(name => {
                this.instance.classList.toggle(name);
            });
            this.emitter.dispatch('toggle', tokens);
        }
        else if (typeof tokens == 'string') {
            this.instance.classList.toggle(tokens);
            this.emitter.dispatch('toggle', tokens);
        }
        return this;
    }
    /**
     * className
     * @description Associé un selecteur CSS
     * @param tokens Selecteur CSS
     */
    classname(tokens) {
        if (tokens) {
            if (typeof tokens == 'string') {
                this.instance.classList.add(tokens);
                this.emitter.dispatch('className', tokens);
            }
            else if (Array.isArray(tokens)) {
                tokens.forEach(token => this.instance.classList.add(token));
                this.emitter.dispatch('className', tokens);
            }
        }
        return this;
    }
    getClassname() {
        return this.instance.className.split(' ');
    }
    /**
     * removeClassName
     * @description Supprimer un selecteur CSS
     * @param tokens Selecteur CSS
     */
    removeClassname(tokens) {
        if (Array.isArray(tokens)) {
            tokens.forEach(name => {
                this.instance.classList.remove(name);
            });
            this.emitter.dispatch('removeClassName', tokens);
        }
        else if (typeof tokens == 'string') {
            this.instance.classList.remove(tokens);
            this.emitter.dispatch('removeClassName', tokens);
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
    attribute(attributes, ns, separator) {
        if (attributes) {
            Object.entries(AttributesObject(attributes, ns, separator))
                .forEach(({ 0: name, 1: attribute }) => {
                this.instance.setAttribute(name, `${attribute}`);
            });
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
    attributeNS(attributes, ns) {
        if (attributes) {
            Object.entries(AttributesObject(attributes, ns, ':'))
                .forEach(({ 0: name, 1: attribute }) => {
                this.instance.setAttribute(name, `${attribute}`);
            });
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
    removeAttribute(attributes, ns, separator) {
        Object.keys(AttributesObject(attributes, ns, separator))
            .forEach(name => {
            this.instance.removeAttribute(name);
        });
        return this;
    }
    /**
     * toggleAttribute
     * @description Basculer le/les attribut(s)
     * @param attributes Attributs sous form d'object
     * @param ns Nom de l'espace
     * @param separator Séparateur de nom d'espace
     */
    toggleAttribute(attributes, ns, separator) {
        Object.entries(AttributesObject(attributes, ns, separator))
            .forEach(({ 0: name, 1: forced }) => {
            this.instance.toggleAttribute(name, forced);
        });
        return this;
    }
}
_AunElement_widget = new WeakMap();
/**
 * AUN State
 * @description Gestionnaire d'état
 */
export class AunState {
    /**
     * Retourne la valeur de l'état
     */
    get value() { return __classPrivateFieldGet(this, _AunState_mirror, "f"); }
    constructor(state) {
        _AunState_instances.add(this);
        _AunState_mirror.set(this, void 0);
        _AunState_recorded.set(this, []);
        _AunState_current.set(this, undefined);
        /**
         * Emetteur
         */
        this.emitter = new EventDispatcher();
        this.state = state;
        __classPrivateFieldSet(this, _AunState_mirror, state, "f");
        // this.#store = state;
        __classPrivateFieldGet(this, _AunState_instances, "m", _AunState_emitters).call(this).initialize();
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
            __classPrivateFieldSet(this, _AunState_mirror, (new Proxy(Object.assign({}, this.state), {
                set(target, prop, newValue) {
                    if (typeof prop == 'string') {
                        //@ts-ignore
                        target[prop] = newValue;
                    }
                    driver.emitter.dispatch('change', newValue);
                    return newValue;
                },
            })), "f");
            this.emitter.dispatch('init', this.state);
        }
        /**
         * Initialize le detecteur d'état sur les autres types de données
         */
        else {
            Object.defineProperty(this, 'state', {
                set(value) {
                    __classPrivateFieldSet(driver, _AunState_mirror, value, "f");
                    driver.emitter.dispatch('change', value);
                },
                get() {
                    const value = __classPrivateFieldGet(driver, _AunState_mirror, "f");
                    // driver.emitter.dispatch('change', value )
                    return value;
                }
            });
            this.emitter.dispatch('init', this.state);
        }
        return this;
    }
    change(callback) {
        this.emitter.listen('change', payload => {
            callback(payload);
        });
        return this;
    }
    /**
     * set
     * @description Modifit l'état
     * @param value Nouvelle valeur de l'état
     * @example
     * state.set( ... )
     */
    set(value) {
        if (this.state && value &&
            typeof this.state == 'object' &&
            typeof value == 'object') {
            try {
                Object.entries(Object.assign({}, value)).forEach(({ 0: prop, 1: data }) => {
                    if (__classPrivateFieldGet(this, _AunState_mirror, "f") && typeof __classPrivateFieldGet(this, _AunState_mirror, "f") == 'object') {
                        __classPrivateFieldGet(this, _AunState_mirror, "f")[prop] = data;
                    }
                });
            }
            catch (err) { }
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
    use(callback) {
        __classPrivateFieldGet(this, _AunState_recorded, "f").push({
            anchor: undefined,
            widget: undefined,
            callback
        });
        return this;
    }
    /**
     * records
     * @description Enregistre les déclarations de l'état pour le référencement
     * @param widget Widget enregistré
     * @example
     * state.records( ... )
     */
    records(widget) {
        __classPrivateFieldGet(this, _AunState_recorded, "f").forEach(record => this.record(widget, record));
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
    record(widget, record) {
        const anchor = document.createTextNode('');
        record.anchor = anchor;
        record.widget = widget;
        widget.element.instance.append(record.anchor);
        return record;
    }
    /**
     * sync
     * @description Synchronise l'état et les déclarations
     * @example
     * state.sync()
     */
    sync() {
        try {
            __classPrivateFieldGet(this, _AunState_recorded, "f").forEach(record => {
                if (record.widget && record.anchor) {
                    __classPrivateFieldSet(this, _AunState_current, record.callback(this.value), "f");
                    record.anchor.parentNode?.replaceChild(__classPrivateFieldGet(this, _AunState_current, "f")?.element.instance, record.anchor);
                    record.anchor = __classPrivateFieldGet(this, _AunState_current, "f")?.element.instance;
                }
            });
        }
        catch (err) {
            this.emitter.dispatch('error', err);
        }
        return this;
    }
    /**
     * catch
     * @description Gestion des érreurs
     * @param callback Fonction de rappel. Cette fonction doit retrouner un Widget
     * @example
     * state.catch( error => ... )
     */
    catch(callback) {
        this.emitter.listen('error', (error) => callback({ manager: this, error }));
        return this;
    }
}
_AunState_mirror = new WeakMap(), _AunState_recorded = new WeakMap(), _AunState_current = new WeakMap(), _AunState_instances = new WeakSet(), _AunState_emitters = function _AunState_emitters() {
    this.emitter.listen('change', () => {
        this.sync();
    });
    return this;
};
/**
 * AUN Widget
 * @description Pour les composant HTML de base
 */
export class AunWidget {
    /**
     * Les propriétés
     */
    get props() { return __classPrivateFieldGet(this, _AunWidget__props, "f"); }
    constructor(tagname, props) {
        _AunWidget_instances.add(this);
        _AunWidget__props.set(this, void 0);
        /**
         * Emetteur
         */
        this.emitter = new EventDispatcher();
        /**
         * Constructe
         */
        this.construct = new AunConstruct();
        __classPrivateFieldSet(this, _AunWidget__props, props, "f");
        this.element = (new AunElement(tagname)).own(this);
        __classPrivateFieldGet(this, _AunWidget_instances, "m", _AunWidget_excavation).call(this, this.props);
    }
    append(...nodes) {
        this.element.instance.append(...nodes);
        return this;
    }
    ready(callback) {
        this.emitter.listen('ready', widget => callback(widget));
        return this;
    }
    manipulate(callback) {
        callback(this.element);
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
    appear(payload) {
        this.construct.makeAppearance(this, payload);
        return this;
    }
    /**
     * content
     * @description Definit le contenu du widget
     * @param child Contenu du widget
     * @example
     * widget.content( ... )
     */
    content(child) {
        if (this.child) {
            const nchildren = [];
            nchildren.forEach(child => nchildren.push(child));
        }
        this.construct.make(this, child);
        this.child = child;
        return this;
    }
    /**
     * refresh
     * @description Rafraichit un widget
     * @example
     * widget.refresh()
     */
    refresh(props) {
        this.element.clean();
        if (props) {
            Object.entries(props).forEach(({ 0: name, 1: prop }) => __classPrivateFieldGet(this, _AunWidget__props, "f")[name] = prop);
        }
        this.content(this.child);
        return this;
    }
    /**
     * render
     * @description Rend le widget
     */
    render() {
        this.element.classname(this.construct.appearance.uid);
        this.construct.make(this, this.child);
        return this;
    }
    /**
     * remove
     * @description Détruit le widget
     */
    remove() {
        this.construct.appearance.destroy();
        this.element.instance.remove();
        this.emitter.dispatch('remove', undefined);
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
    timeOut(callback, time) {
        let timer = undefined;
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
    timeInterval(callback, time) {
        let timer = undefined;
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
    frameReady(callback) {
        requestAnimationFrame(() => callback(this));
        return this;
    }
}
_AunWidget__props = new WeakMap(), _AunWidget_instances = new WeakSet(), _AunWidget_excavation = function _AunWidget_excavation(props) {
    Object.entries(props).forEach(({ 0: key, 1: value }) => {
        if (key == 'child') {
            this.child = value;
        }
        else {
            __classPrivateFieldSet(this, _AunWidget__props, value, "f");
        }
    });
    this.emitter.dispatch('excavation', this);
    return this;
};
/**
 * AUN Construct
 * @description Constructeur de Widget
 */
export class AunConstruct {
    constructor() {
        /**
         * Emetteur
         */
        this.emitter = new EventDispatcher();
        /**
         * Apparence
         */
        this.appearance = new CoreAppearance();
        this.appearance.emitter.listen('sync', appear => {
            this.emitter.dispatch('appearance', appear);
        });
        this.appearance.mount();
    }
    /**
     * make
     * @description Créer le constructeur
     * @param root Racine Widget
     * @param child Enfants à ajouter
     */
    make(root, child) {
        this.emitter.dispatch('before', root);
        root.emitter.dispatch('beforeRendering', child);
        this.makeChildren(root, child);
        root.emitter.dispatch('afterRendering', child);
        this.emitter.dispatch('after', root);
        root.emitter.dispatch('ready', root);
        return root;
    }
    /**
     * makeChildren
     * @description Construire les enfants
     * @param root Racine Widget
     * @param child Enfants à ajouter
     */
    makeChildren(root, child) {
        if (child instanceof Element) {
            root.element.instance.append(child);
            root.emitter.dispatch('elementAdded', child);
            root.emitter.dispatch('childAdded', child);
        }
        else if (child instanceof AunState) {
            child.records(root);
            root.emitter.dispatch('stateAdded', child);
            root.emitter.dispatch('childAdded', child);
        }
        else if (typeof child == 'string' ||
            typeof child == 'boolean' ||
            typeof child == 'number') {
            root.element.instance.innerHTML = (`${child}`);
            root.emitter.dispatch('htmlAdded', child);
            root.emitter.dispatch('childAdded', child);
        }
        else if (child instanceof AunWidget) {
            root.element.instance.append(child.element.instance);
            root.emitter.dispatch('widgetAdded', child);
            root.emitter.dispatch('childAdded', child);
            child.emitter.dispatch('ready', child);
        }
        else if (Array.isArray(child)) {
            child.forEach(child => this.make(root, child));
        }
        if (child instanceof Promise) {
            const anchor = document.createTextNode('');
            root.element.instance.append(anchor);
            child.then(component => {
                root.element.instance.replaceChild(component.element.instance, anchor);
                root.emitter.dispatch('promiseAdded', child);
                root.emitter.dispatch('childAdded', child);
            }).catch(er => {
                throw (`AunConstruct : ${JSON.stringify(er)}`);
            });
        }
        return root;
    }
    /**
     * makeAppearance
     * @description Construire l'apparence
     * @param root
     * @param payload
     */
    makeAppearance(root, payload) {
        this.appearance.set(payload);
        return root;
    }
}
export class AunView {
    get parameters() { return __classPrivateFieldGet(this, _AunView__parameters, "f"); }
    get component() { return __classPrivateFieldGet(this, _AunView__component, "f"); }
    constructor(componentConstructor, options) {
        _AunView__parameters.set(this, {});
        _AunView__component.set(this, undefined);
        this.componentConstructor = componentConstructor;
        this.options = options || {};
    }
    show(parameters) {
        __classPrivateFieldSet(this, _AunView__parameters, parameters, "f");
        this.component?.element.removeStyle('display');
        return this;
    }
    hide() {
        this.component?.element.style({ display: 'none' });
        return this;
    }
    refresh(parameters) {
        // Mise à jour des paramètre
        __classPrivateFieldSet(this, _AunView__parameters, UpdateObject(__classPrivateFieldGet(this, _AunView__parameters, "f"), parameters), "f");
        // Reconstruit le composant
        const render = this.render();
        // Remplacement basket
        this.component?.element.instance.parentNode?.replaceChild(render.element.instance, this.component?.element.instance);
        return this;
    }
    render() {
        __classPrivateFieldSet(this, _AunView__component, this.componentConstructor(this.parameters), "f");
        return __classPrivateFieldGet(this, _AunView__component, "f");
    }
}
_AunView__parameters = new WeakMap(), _AunView__component = new WeakMap();
export class AunStackViews {
    /**
     * Les vues
     */
    get views() { return __classPrivateFieldGet(this, _AunStackViews_views, "f"); }
    /**
     * Composant Actuellement utilisé
     */
    get current() { return __classPrivateFieldGet(this, _AunStackViews_current, "f"); }
    ;
    constructor(views, options) {
        _AunStackViews_instances.add(this);
        _AunStackViews_views.set(this, {});
        _AunStackViews_current.set(this, undefined);
        /**
         * Dernier composant utilisé
         */
        this.last = undefined;
        /**
         * Options
         */
        this.options = {};
        /**
         * Système de navigation
         */
        this.navigation = new Navigation();
        /**
         * Emétteur
         */
        this.emitter = new EventDispatcher();
        __classPrivateFieldSet(this, _AunStackViews_views, views, "f");
        this.options = options || {};
        this.navigation.setOptions({
            middlewares: [
                __classPrivateFieldGet(this, _AunStackViews_instances, "m", _AunStackViews_defaultMiddleware).bind(this),
                ...(this.options.middlewares || []),
            ],
            useHashtagParser: (typeof this.options.useHashtagParser != 'undefined')
                ? this.options.useHashtagParser
                : true,
            capture: (typeof this.options.capture != 'undefined')
                ? this.options.capture
                : true,
        });
        __classPrivateFieldGet(this, _AunStackViews_instances, "m", _AunStackViews_initializeCanvas).call(this);
    }
    middleware(callback) {
        this.navigation.options.middlewares?.push(callback);
        return this;
    }
    /**
     * Démarrage
     */
    run() {
        this.navigation.observe();
        if (this.options.index) {
            this.navigation.navigate(this.navigation.currentRouteName() || this.options.index, this.navigation.currentQuery() || undefined, undefined);
        }
        return this;
    }
}
_AunStackViews_views = new WeakMap(), _AunStackViews_current = new WeakMap(), _AunStackViews_instances = new WeakSet(), _AunStackViews_initializeCanvas = function _AunStackViews_initializeCanvas() {
    findElement(this.options.canvas, canvas => {
        canvas.style.position = 'relative';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.overflow = 'auto';
        canvas.style.maxWidth = '100vw';
        canvas.style.maxHeight = '100vh';
    });
    return this;
}, _AunStackViews_getOldView = function _AunStackViews_getOldView() {
    const name = this.navigation.oldRouteName()?.split('?')[0];
    return name ? __classPrivateFieldGet(this, _AunStackViews_views, "f")[name] || undefined : undefined;
}, _AunStackViews_createViewProps = function _AunStackViews_createViewProps(props) {
    return {
        ...(props || {}),
        stack: this
    };
}, _AunStackViews_defaultMiddleware = function _AunStackViews_defaultMiddleware({ props, routeName }) {
    const view = __classPrivateFieldGet(this, _AunStackViews_views, "f")[routeName] || undefined;
    if (view && this.options.canvas) {
        findElement(this.options.canvas, canvas => {
            const component = view.componentConstructor(__classPrivateFieldGet(this, _AunStackViews_instances, "m", _AunStackViews_createViewProps).call(this, props));
            const transitionAvailable = view?.options.transitions && component.element.instance;
            const oldView = __classPrivateFieldGet(this, _AunStackViews_instances, "m", _AunStackViews_getOldView).call(this);
            __classPrivateFieldSet(this, _AunStackViews_current, component, "f");
            component.element.style({
                position: 'absolute',
                top: '0',
                left: '0',
                zIndex: '2'
            });
            if (view.options.title) {
                document.title = `${view.options.title}`;
            }
            if (this.last) {
                component.element.style({
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    zIndex: '1'
                });
            }
            if (transitionAvailable) {
                component.element.on('transitionend', () => {
                });
                view.options.transitions?.entry.startIn(component.element.instance, () => {
                    this.last?.element.remove();
                    this.last = component;
                });
                if (this.last) {
                    oldView?.options.transitions?.exit.startOut(this.last.element.instance, () => { });
                }
                canvas.append(component.element.instance);
            }
            if (!transitionAvailable) {
                canvas.innerText = '';
                canvas.append(component.element.instance);
                this.last = component;
            }
        });
    }
    else {
        this.emitter.dispatch('error', routeName);
    }
    return this;
};
