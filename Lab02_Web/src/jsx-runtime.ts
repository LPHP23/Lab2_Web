// JSX Type Definition
declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface ElementClass {
      render(): VNode;
    }
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// VNode Interface
export interface VNode {
  type: string | ComponentFunction;
  props: Record<string, any>;
  children: (VNode | string | number)[];
}

export interface ComponentProps {
  children?: (VNode | string | number)[];
  [key: string]: any;
}

export type ComponentFunction = (props: ComponentProps) => VNode;

// State management
let currentComponent: any = null;
let stateIndex = 0;
const componentStates = new WeakMap();

// Create Element
export function createElement(
  type: string | ComponentFunction,
  props: Record<string, any> | null,
  ...children: (VNode | string | number)[]
): VNode {
  const normalizedProps = props || {};
  const flatChildren = children.flat(Infinity).filter(child => child != null);
  
  return {
    type,
    props: { ...normalizedProps, children: flatChildren },
    children: flatChildren
  };
}

// Create Fragment
export function createFragment(
  props: Record<string, any> | null,
  ...children: (VNode | string | number)[]
): VNode {
  return createElement('fragment', props, ...children);
}

// Convert camelCase to kebab-case
function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}

// Render VNode to DOM
export function renderToDOM(vnode: VNode | string | number): Node {
  // Handle text nodes
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  }

  // Ensure vnode has required properties
  if (!vnode || typeof vnode !== 'object') {
    return document.createTextNode('');
  }

  // Handle fragments
  if (vnode.type === 'fragment') {
    const fragment = document.createDocumentFragment();
    (vnode.children || []).forEach(child => {
      fragment.appendChild(renderToDOM(child));
    });
    return fragment;
  }

  // Handle component functions
  if (typeof vnode.type === 'function') {
    currentComponent = vnode.type;
    stateIndex = 0;
    const result = vnode.type(vnode.props || {});
    return renderToDOM(result);
  }

  // Handle regular HTML elements
  const element = document.createElement(vnode.type as string);

  // Set attributes and properties
  const props = vnode.props || {};
  Object.entries(props).forEach(([key, value]) => {
    if (key === 'children') return;

    // Handle ref
    if (key === 'ref' && typeof value === 'function') {
      value(element);
      return;
    }

    // Handle events
    if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.substring(2).toLowerCase();
      element.addEventListener(eventName, value);
      return;
    }

    // Handle style
    if (key === 'style') {
      if (typeof value === 'object') {
        Object.entries(value).forEach(([styleProp, styleValue]) => {
          (element.style as any)[styleProp] = styleValue;
        });
      } else if (typeof value === 'string') {
        element.setAttribute('style', value);
      }
      return;
    }

    // Handle className
    if (key === 'className') {
      element.setAttribute('class', value);
      return;
    }

    // Handle boolean attributes
    if (typeof value === 'boolean') {
      if (value) {
        element.setAttribute(key, '');
      }
      return;
    }

    // Regular attributes
    if (value != null) {
      element.setAttribute(key, String(value));
    }
  });

  // Append children
  const propsObj = vnode.props || {};
  const childrenToRender = propsObj.children || vnode.children;
  if (Array.isArray(childrenToRender)) {
    childrenToRender.forEach(child => {
      element.appendChild(renderToDOM(child));
    });
  }

  return element;
}

// Mount to container
export function mount(vnode: VNode, container: HTMLElement): void {
  container.innerHTML = '';
  container.appendChild(renderToDOM(vnode));
}

// useState Hook
export function useState<T>(initialValue: T): [() => T, (newValue: T | ((prev: T) => T)) => void] {
  const component = currentComponent;
  const index = stateIndex++;

  if (!componentStates.has(component)) {
    componentStates.set(component, []);
  }

  const states = componentStates.get(component);

  if (states[index] === undefined) {
    states[index] = initialValue;
  }

  const getValue = () => states[index];
  
  const setValue = (newValue: T | ((prev: T) => T)) => {
    const value = typeof newValue === 'function' 
      ? (newValue as (prev: T) => T)(states[index])
      : newValue;
    
    if (states[index] !== value) {
      states[index] = value;
      // Trigger re-render
      if (typeof window !== 'undefined' && (window as any).__rerender) {
        (window as any).__rerender();
      }
    }
  };

  return [getValue, setValue];
}