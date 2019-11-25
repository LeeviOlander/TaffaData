var converter = new showdown.Converter();


var markdown = 
`	
# Client Side Application

TODO

`;


application.setContent(converter.makeHtml(markdown));