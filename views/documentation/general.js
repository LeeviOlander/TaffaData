var converter = new showdown.Converter();


var markdown =
	`	
# General

## Terminology

- **MA Span** = Moving Average Span. Used to filter out noise from the data. Note: This is a lagging transformation. See [Wikipedia]

`;


application.setContent(converter.makeHtml(markdown));