var converter = new showdown.Converter();


var markdown =
`
# Server Side Application

TODO

`;


application.setContent(converter.makeHtml(markdown));