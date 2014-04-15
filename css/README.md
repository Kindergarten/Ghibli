# Inverted Pyramid

For this project we use `Inverted Pyramid` method developed by [Harry Roberts](http://csswizardry.com).

Each layer has a specific role, and 99% of all rules will slot into one of them. This specific guide is written with a preprocessor in mind but if you are not using a preprocessor, ignore the settings and tools layers.

 - **Settings** are global Sass variables that might contain colors, font sizes, config switches, file paths, etc. This layer is defined first as these settings need to be made available to the rest of the project.
 - **Tools** are things like mixins and functions that might provide useful, reusable functionality. These are defined second because they might take a variable (defined in the previous layer) as a default argument, but they still need to be made available to the rest of the project.
 - **Generic** rules are things like CSS resets, Normalize.css, clearfixes, global box-sizing rules, and so on. This is the first layer that actually produces any CSS, and if you are not using a preprocessor, this is where your project will start. The rules in this layer typically have a very low specificity and tend to affect large—if not all—parts of the DOM, e.g. * {}.
 - **Base** layer rules are rules that select and style all types of elements, e.g. h2 {}, ul {}, blockquote {}. As such, the selectors in this layer are usually type selectors that only target semantic HTML elements. This layer would answer the question what would an h2 look like if I just dropped it straight into the page without a class on it? As we can see, we are slowly targeting more and more specific parts of the DOM.
 - **Objects** are rules that style objects and abstractions. These rules use class selectors, and provide structural, design-free UI treatments, e.g. grid systems, or the media object. This layer doesn’t provide any cosmetic styling, and exists only to house abstracted design patterns in an OOCSS project.
 - **Components** are discrete, designed UI elements—this layer takes the previous layers and combines them into components that have a design/skin on them. Again, we can see how the layers progressively add to and extend the layers defined previously.
 - **Trumps** are the final type of rule a project will have. These are things like helper classes and overrides that will only affect very specific, explicit parts of the DOM; things like error states, or text helper classes. These are defined last because they don’t want to pass any of their styling on to anything else, and they usually carry the highest specificity, often carrying the !important flag on their declarations.

To summarise this a little more tersely:

 - We have **settings** that might define styles for large parts of the DOM.
 - We have **tools** that can be used to style many different types of element.
 - We have **generic** rules like resets that will affect lots—if not all—of the DOM in one go.
 - We have **base** rules that style all particular types of DOM element.
 - We have **objects** which provide structural styling to any parts of the DOM that we decide might require it.
 - We have **components** which give very specific styles to a specific set of DOM elelments.
 - We have trumps that provide incredibly specific styles to single parts of the DOM.

We can take elements as far as we want through any of these layers. For example, a label might just end at the base layer, with no need for objects, components, or even error states. The beauty of the Inverted Triangle is that it allows us to extend these layers only if and when we ever need to.