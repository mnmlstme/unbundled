# Views and ViewModels

Components in `@unbndl` are standard web components—classes which 
extend `HTMLElement`. Typically, components are responsible for
updating their Shadow DOM in response to changes in their attributes
or other kinds of state. They do so by declaring _views_ and linking those
views to _viewModels_.

The template for a view is built using [`html`-tagged template literals](./html.md).
To implement reactivity, these templates may contain functions as substitution parameters.
The functions accept a viewModel as their argument.

Views must be _rendered_ before they can be attached to the DOM. Since the functions
in a view require a viewModel to be evaluated, rendering can only be done in the context
of a viewModel. As a result of this rendering process, the view becomes reactive to
any changes in the viewModel. Whenever the viewModel changes, the functions are re-evaluated,
and the resultant values substituted into the DOM.

## `ViewModel<T>`

`ViewModel<T>` is a generic type which creates a viewModel for a component. The type
argument `T` is an interface defining the state which will be maintained in the viewModel.

### `createViewModel<T>(` _init_ `: T)`

Components typically have one viewModel, often assigned to the `viewModel` property of
the component's class. The viewModel can be created by calling `createViewModel<T>`
to initialize the class' `viewModel` property. The `init` parameter is used to initialize
the properties of the viewModel, and is required, unless all of the viewModel's properties
are optional.

#### Usage

```ts
import { createViewModel } from "@unbndl/modules/view";

type ProfileMode = "view" | "edit" | "new";

interface ProfileViewModel {
  mode: ProfileMode;
  userid?: string;
  profile?: Traveler;
  username?: string | undefined;
}

export class ProfileViewElement extends HTMLElement {
  viewModel = createViewModel<ProfileViewModel>({
    mode: "view" as ProfileMode // must initialize mode
  });
  
  // ...
}
```

### _viewModel_ `.with(` _source_ `: Source<S>, ...` _names_ `)`

The data which the viewModel makes accessible to the view is often sourced
outside the component. For example, values may come from the element's attributes,
or any provider, such as `<auth-provider>` or `<store-provider>`. 

To connect these sources to the viewModel, and
ensure that the effects of any changes to these data will propagate to the view,
the viewModel must observe the source. This is established by calling the `with`
method on the viewModel, passing it the source. To use a subset of the 
source's properties, a list of _names_ may also be provided. (Note that 
the names  in the source and the viewModel must be the same.)

> Reducing the list of property names in `with` helps to reduce coupling
> and can improve performance by filtering out irrelevant change events.

#### Usage

```ts
import { createViewModel } from "@unbndl/modules/view";
import { fromAuth } from "@unbndl/modules/auth";

export class ProfileViewElement extends HTMLElement {
  viewModel = createViewModel<ProfileViewModel>({
    mode: "view" as ProfileMode // must initialize mode
  })
  .with(fromAuth(this), "username");

  // ...
}
```

### _viewModel_ `.withRenamed(`<br>_source_ `: Source<S>, ` <br>_mapping_ `: { [K in keyof Partial<T>]: keyof S })`

When the names of source properties do not match those of the viewModel, they can be renamed
using `withRenamed`. This is particularly the case for attributes, which are not case-sensitive
but can contain hyphens. The keys of the _mapping_ are the viewModel property names, and
each value is the name of a property in the source.

#### Usage

```ts
import { createViewModel, fromAttributes } from "@unbndl/modules/view";
import { fromAuth } from "@unbndl/modules/auth";

type ProfileViewAttributes = { "user-id"?: string };

export class ProfileViewElement extends HTMLElement {
  viewModel = createViewModel<ProfileViewModel>({
    mode: "view" as ProfileMode // must initialize mode
  })
  .with(fromAuth(this), "username")
  .withRenamed(fromAttributes<ProfileViewAttributes>(this), {
    userid: "user-id"
  })

  // ...
}
```

### _viewModel_ `.withCalculated(`<br>_source_ `: Source<S>, ` <br>_mapping_ `: NameMapping<T,S>)`

Properties of the viewModel may also be derived from source properties by using `withCalculated`.
In this case, the keys of the _mapping_ identify viewModel properties, and the value
associate with each is either a string (which functions like `withRenamed`) or a function which
takes the entire source state (of type S) and returns a value for the property.

### _viewModel_ `.render(` _view_ `: View<T>)`

Views are rendered through the viewModel using this method. A view is typically only rendered
once, because the process sets up all effects necessary to update the view on any 
changes to the viewModel. The result is a `DocumentFragment` which can be added to the DOM.
This is typically done in the component's constructor.

#### Usage

```ts
import { shadow } from "@unbndl/modules/html";

export class ProfileViewElement extends HTMLElement {
  viewModel = // see above
  view = // see below
    
  constructor() {
    super();
    shadow(this)
      .replace(this.viewModel.render(this.view))
    
    // ...
  }
}
```

## Views
