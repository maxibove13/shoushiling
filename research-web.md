# Things I learned / tips

## CSS Animations

To use animations in CSS you must define the keyframes, i.e. the frames where a transformation of the element will occur. Those keyframes are defined as a percentage, and inside each percentage you can apply any CSS property you like.
For example:

```
@keyframes pulse {
  0% {
    transform: scale(1.1);
  }

  70% {
    transform: scale(0.9);
  }

  100% {
    transform: scale(1.1);
  }
}
```

Here a transformation to scale the element from 1.1 to 0.9 and back to 1.1 will be applied in the key frames of 0%, 70% and 100% of the total time that the animation lasts.

Then just call the property animation with the name of the keyframe and specify the length and the loop kind.
e.g.:

```
.clicked {
  transform: scale();
  animation: pulse 1.5s infinite;
}
```

## Environmental variables in React

To use .env config files in React you must start the environmental variables with the prefix `REACT_APP_`
All variables inside a file named `.env` in the main create-react-app folder will automatically be available as: `process.env.REACT_APP_<yourenvvarname>`

### Conditional classnames

It is better practice to use something like:

```
className={menu ? "show-nav" : undefined}
```

than

```
className={menu && "show-nav"}
```

Because in the last case when the condition is not satisfied it returns false, and could lead to some problems to have a className set to false.

## CSS transform

A simple usage of transform is to rotate and/or translate an element. Just type the property transform follow by the keyword `rotate(45deg)` where 45 could be any degree you like.
If you want to translate an element just `translate(x,y)` should do it, where x and y are the coordinates in the horizontal and vertical directions respectively in px or any unit of measure you want.
You can also combine several transform properties just by setting an spacebar between them. For example:

```
.any-classname {
    transform: rotate(45deg) translate(4px, 2px);
}
```

## CSS gradient background

In order to have a gradient background the `background-image` property does it:

```
background-image: linear-gradient(180deg, white 0%, black 100%);
```

As it is shown, you can specify the orientation of the gradient as well as the percentage of the color you would like to have in the extremes.

It is also useful the CSS property `background-repeat` to be set in `no-repeat` in order to have a single gradient background.

## Lottie animations

[Lottie files](https://lottiefiles.com/) web is a repository of several animations created by designers you can download for free and make your website more lively.

In order to use it, just download the .json file of the animation you like and import it in a react component. (There are other ways you can use the animation)

In order for the animation to work you must specify some options. The default options are:

```
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    }
```

Then, return the Lottie component as follows:

```
<Lottie className="lottie" options={defaultOptions} height={<height in px>} width={<height in px>}
```

## switch (true)

Whenever you have many cases that you must evaluate and take certain actions, instead of using `if` and `else if ` you can use the switch statement for simplicity:

```
switch (expresion) {
  case value1:
    //
    break;
  case value2:
    //
    break;
  ...
  case valueN:
    //
    break;
  default:
    //
    break;
}
```

But what happens when you have different expressions also? You can use switch (true):

```
switch (true) {
    case expression1:
    //
    case expression2:
    //
    ...
    case expressionN:
    //
    default:
    //
}
```

## Conditional rendering

In a React component you generally return JSX, but you can also return a function and/or JSX, and in that function return any JSX you want.
e.g:

```

const MyComponent = () => {

    const greetings = () => {
        return (
            <h1>Hello World!</h1>
        )
    }

    return (
        {greetings()}
        <h2>Take care</h2>
    )
}

export default MyComponent
```

You can also set conditionals inside the function in order to return different JSX depending on certain conditions. This is useful when you have too many conditions and using ternary operators gets a little confusing.

```
const MyComponent = () => {

    const greetings = () => {
        if (arriving) {
            return (
                <h1>Hello World!</h1>
            )
        } else if (leaving) {
            return (
                <h1>Goodbye World!</h1>
            )
        } else {
            return (
                <h1>Would you like to chat?</h1>
            )
        }

    }

    return (
        {greetings()}
        <h2>Take care</h2>
    )
}

export default MyComponent
```

## Detect blankspace in a string

```
/\s/.test(<string>)
```

Returns true if it has any blank space and false if it doesn't.
