# Sample Markdown File

This file contains examples of various markdown elements for testing the linting and fixing functionality.

## Heading with trailing spaces  

This paragraph has trailing spaces at the end.  

### Multiple consecutive blank lines are not allowed


There should be only one blank line above.

#### Code blocks need language specifiers

```
This code block has no language specified
```

##### Lists should be properly formatted
- Item 1
- Item 2
- Item 3

###### Emphasis style should be consistent

*This text is emphasized with asterisks*
_This text is emphasized with underscores_

## Long lines

This is a very long line that exceeds the default line length limit but would be allowed with our custom configuration that sets the limit to 120 characters.

## Proper link formatting

[This link](https://example.com) is properly formatted, but [this one] (https://example.com) has an invalid space.

## HTML elements

<div>This HTML element would be flagged by default, but our configuration allows it.</div>

## Fenced code blocks

Fenced code blocks should have blank lines around them:
```javascript
function example() {
  console.log('Hello, world!');
}
```
This text is too close to the code block above.
