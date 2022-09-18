import { createUseStyles } from 'react-jss'

import { Theme } from './types'

const dracula = {
  //'& code[class*="language-"], pre[class*="language-"]': {
  color: '#f8f8f2',
  //  background: 'none',
  //  textShadow: '0 1px rgba(0, 0, 0, 0.3)',
  //  fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
  //  textAlign: 'left',
  //  whiteSpace: 'pre',
  //  wordSpacing: 'normal',
  //  wordBreak: 'normal',
  //  wordWrap: 'normal',
  //  lineHeight: '1.5',
  //  mozTabSize: '4',
  //  oTabSize: '4',
  //  tabSize: '4',
  //  webkitHyphens: 'none',
  //  mozHyphens: 'none',
  //  msHyphens: 'none',
  //  hyphens: 'none'
  //},
  //'& pre[class*="language-"]': {
  //  padding: '1em',
  //  margin: '.5em 0',
  //  overflow: 'auto',
  //  borderRadius: '0.3em'
  //},
  //'&:not(pre) > code[class*="language-"], pre[class*="language-"]': {
  //  background: '#282a36'
  //},
  '& .token.comment, .token.prolog, .token.doctype, .token.cdata': {
    color: '#6272a4'
  },
  '& .token.punctuation': {
    color: '#f8f8f2'
  },
  '& .namespace': {
    opacity: '.7'
  },
  '& .token.property, .token.tag, .token.constant, .token.symbol, .token.deleted': {
    color: '#ff79c6'
  },
  '& .token.boolean, .token.number': {
    color: '#bd93f9'
  },
  '& .token.selector, .token.attr-name, .token.string, .token.char, .token.builtin, .token.inserted':
    {
      color: '#50fa7b'
    },
  '& .token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string, .token.variable':
    {
      color: '#f8f8f2'
    },
  '& .token.atrule, .token.attr-value, .token.function, .token.class-name': {
    color: '#f1fa8c'
  },
  '& .token.keyword': {
    color: '#8be9fd'
  },
  '& .token.regex, .token.important': {
    color: '#ffb86c'
  },
  '& .token.important, .token.bold': {
    fontWeight: 'bold'
  },
  '& .token.italic': {
    fontStyle: 'italic'
  },
  '& .token.entity': {
    cursor: 'help'
  }
}

const oneLight = {
  //'code[class*="language-"], pre[class*="language-"]': {
  //  background: 'hsl(230, 1%, 98%)',
  color: 'hsl(230, 8%, 24%)',
  //  fontFamily:
  //    '"Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace',
  //  direction: 'ltr',
  //  textAlign: 'left',
  //  whiteSpace: 'pre',
  //  wordSpacing: 'normal',
  //  wordBreak: 'normal',
  //  lineHeight: '1.5',
  //  mozTabSize: '2',
  //  oTabSize: '2',
  //  tabSize: '2',
  //  webkitHyphens: 'none',
  //  mozHyphens: 'none',
  //  msHyphens: 'none',
  //  hyphens: 'none'
  //},
  //'code[class*="language-"]::-moz-selection, code[class*="language-"] *::-moz-selection, pre[class*="language-"] *::-moz-selection':
  //  {
  //    background: 'hsl(230, 1%, 90%)',
  //    color: 'inherit'
  //  },
  //'code[class*="language-"]::selection, code[class*="language-"] *::selection, pre[class*="language-"] *::selection':
  //  {
  //    background: 'hsl(230, 1%, 90%)',
  //    color: 'inherit'
  //  },
  //'pre[class*="language-"]': {
  //  padding: '1em',
  //  margin: '0.5em 0',
  //  overflow: 'auto',
  //  borderRadius: '0.3em'
  //},
  //':not(pre) > code[class*="language-"]': {
  //  padding: '0.2em 0.3em',
  //  borderRadius: '0.3em',
  //  whiteSpace: 'normal'
  //},
  '& .token.comment, .token.prolog, .token.cdata': {
    color: 'hsl(230, 4%, 64%)'
  },
  '& .token.doctype, .token.punctuation, .token.entity': {
    color: 'hsl(230, 8%, 24%)'
  },
  '& .token.attr-name, .token.class-name, .token.boolean, .token.constant, .token.number, .token.atrule':
    {
      color: 'hsl(35, 99%, 36%)'
    },
  '& .token.keyword': {
    color: 'hsl(301, 63%, 40%)'
  },
  '& .token.property, .token.tag, .token.symbol, .token.deleted, .token.important': {
    color: 'hsl(5, 74%, 59%)'
  },
  '& .token.selector, .token.string, .token.char, .token.builtin, .token.inserted, .token.regex, .token.attr-value, .token.attr-value > .token.punctuation':
    {
      color: 'hsl(119, 34%, 47%)'
    },
  '& .token.variable, .token.operator, .token.function': {
    color: 'hsl(221, 87%, 60%)'
  },
  '& .token.url': {
    color: 'hsl(198, 99%, 37%)'
  },
  '& .token.attr-value > .token.punctuation.attr-equals, .token.special-attr > .token.attr-value > .token.value.css':
    {
      color: 'hsl(230, 8%, 24%)'
    },
  '& .language-css .token.selector': {
    color: 'hsl(5, 74%, 59%)'
  },
  '& .language-css .token.property': {
    color: 'hsl(230, 8%, 24%)'
  },
  '& .language-css .token.function, .language-css .token.url > .token.function': {
    color: 'hsl(198, 99%, 37%)'
  },
  '& .language-css .token.url > .token.string.url': {
    color: 'hsl(119, 34%, 47%)'
  },
  '& .language-css .token.important, .language-css .token.atrule .token.rule': {
    color: 'hsl(301, 63%, 40%)'
  },
  '& .language-javascript .token.operator': {
    color: 'hsl(301, 63%, 40%)'
  },
  '& .language-javascript .token.template-string > .token.interpolation > .token.interpolation-punctuation.punctuation':
    {
      color: 'hsl(344, 84%, 43%)'
    },
  '& .language-json .token.operator': {
    color: 'hsl(230, 8%, 24%)'
  },
  '& .language-json .token.null.keyword': {
    color: 'hsl(35, 99%, 36%)'
  },
  '& .language-markdown .token.url, .language-markdown .token.url > .token.operator, .language-markdown .token.url-reference.url > .token.string':
    {
      color: 'hsl(230, 8%, 24%)'
    },
  '& .language-markdown .token.url > .token.content': {
    color: 'hsl(221, 87%, 60%)'
  },
  '& .language-markdown .token.url > .token.url, .language-markdown .token.url-reference.url':
    {
      color: 'hsl(198, 99%, 37%)'
    },
  '& .language-markdown .token.blockquote.punctuation, .language-markdown .token.hr.punctuation':
    {
      color: 'hsl(230, 4%, 64%)',
      fontStyle: 'italic'
    },
  '& .language-markdown .token.code-snippet': {
    color: 'hsl(119, 34%, 47%)'
  },
  '& .language-markdown .token.bold .token.content': {
    color: 'hsl(35, 99%, 36%)'
  },
  '& .language-markdown .token.italic .token.content': {
    color: 'hsl(301, 63%, 40%)'
  },
  '& .language-markdown .token.strike .token.content, .language-markdown .token.strike .token.punctuation, .language-markdown .token.list.punctuation, .language-markdown .token.title.important > .token.punctuation':
    {
      color: 'hsl(5, 74%, 59%)'
    },
  '& .token.bold': {
    fontWeight: 'bold'
  },
  '& .token.comment, .token.italic': {
    fontStyle: 'italic'
  },
  '& .token.entity': {
    cursor: 'help'
  },
  '& .token.namespace': {
    opacity: '0.8'
  },
  '& .token.token.tab:not(:empty):before, .token.token.cr:before, .token.token.lf:before, .token.token.space:before':
    {
      color: 'hsla(230, 8%, 24%, 0.2)'
    },
  '& .rainbow-braces .token.token.punctuation.brace-level-1, .rainbow-braces .token.token.punctuation.brace-level-5, .rainbow-braces .token.token.punctuation.brace-level-9':
    {
      color: 'hsl(5, 74%, 59%)'
    },
  '& .rainbow-braces .token.token.punctuation.brace-level-2, .rainbow-braces .token.token.punctuation.brace-level-6, .rainbow-braces .token.token.punctuation.brace-level-10':
    {
      color: 'hsl(119, 34%, 47%)'
    },
  '& .rainbow-braces .token.token.punctuation.brace-level-3, .rainbow-braces .token.token.punctuation.brace-level-7, .rainbow-braces .token.token.punctuation.brace-level-11':
    {
      color: 'hsl(221, 87%, 60%)'
    },
  '& .rainbow-braces .token.token.punctuation.brace-level-4, .rainbow-braces .token.token.punctuation.brace-level-8, .rainbow-braces .token.token.punctuation.brace-level-12':
    {
      color: 'hsl(301, 63%, 40%)'
    },
  '& pre.diff-highlight > code .token.token.deleted:not(.prefix), pre > code.diff-highlight .token.token.deleted:not(.prefix)':
    {
      backgroundColor: 'hsla(353, 100%, 66%, 0.15)'
    },
  '& pre.diff-highlight > code .token.token.deleted:not(.prefix)::-moz-selection, pre.diff-highlight > code .token.token.deleted:not(.prefix) *::-moz-selection, pre > code.diff-highlight .token.token.deleted:not(.prefix)::-moz-selection, pre > code.diff-highlight .token.token.deleted:not(.prefix) *::-moz-selection':
    {
      backgroundColor: 'hsla(353, 95%, 66%, 0.25)'
    },
  '& pre.diff-highlight > code .token.token.deleted:not(.prefix)::selection, pre.diff-highlight > code .token.token.deleted:not(.prefix) *::selection, pre > code.diff-highlight .token.token.deleted:not(.prefix)::selection, pre > code.diff-highlight .token.token.deleted:not(.prefix) *::selection':
    {
      backgroundColor: 'hsla(353, 95%, 66%, 0.25)'
    },
  '& pre.diff-highlight > code .token.token.inserted:not(.prefix), pre > code.diff-highlight .token.token.inserted:not(.prefix)':
    {
      backgroundColor: 'hsla(137, 100%, 55%, 0.15)'
    },
  '& pre.diff-highlight > code .token.token.inserted:not(.prefix)::-moz-selection, pre.diff-highlight > code .token.token.inserted:not(.prefix) *::-moz-selection, pre > code.diff-highlight .token.token.inserted:not(.prefix)::-moz-selection, pre > code.diff-highlight .token.token.inserted:not(.prefix) *::-moz-selection':
    {
      backgroundColor: 'hsla(135, 73%, 55%, 0.25)'
    },
  '& pre.diff-highlight > code .token.token.inserted:not(.prefix)::selection, pre.diff-highlight > code .token.token.inserted:not(.prefix) *::selection, pre > code.diff-highlight .token.token.inserted:not(.prefix)::selection, pre > code.diff-highlight .token.token.inserted:not(.prefix) *::selection':
    {
      backgroundColor: 'hsla(135, 73%, 55%, 0.25)'
    },
  '.prism-previewer.prism-previewer:before, .prism-previewer-gradient.prism-previewer-gradient div':
    {
      borderColor: 'hsl(0, 0, 95%)'
    },
  '.prism-previewer-color.prism-previewer-color:before, .prism-previewer-gradient.prism-previewer-gradient div, .prism-previewer-easing.prism-previewer-easing:before':
    {
      borderRadius: '0.3em'
    },
  '.prism-previewer.prism-previewer:after': {
    borderTopColor: 'hsl(0, 0, 95%)'
  },
  '.prism-previewer-flipped.prism-previewer-flipped.after': {
    borderBottomColor: 'hsl(0, 0, 95%)'
  },
  '.prism-previewer-angle.prism-previewer-angle:before, .prism-previewer-time.prism-previewer-time:before, .prism-previewer-easing.prism-previewer-easing':
    {
      background: 'hsl(0, 0%, 100%)'
    },
  '.prism-previewer-angle.prism-previewer-angle circle, .prism-previewer-time.prism-previewer-time circle':
    {
      stroke: 'hsl(230, 8%, 24%)',
      strokeOpacity: '1'
    },
  '.prism-previewer-easing.prism-previewer-easing circle, .prism-previewer-easing.prism-previewer-easing path, .prism-previewer-easing.prism-previewer-easing line':
    {
      stroke: 'hsl(230, 8%, 24%)'
    },
  '.prism-previewer-easing.prism-previewer-easing circle': {
    fill: 'transparent'
  }
}

const usePrismStyles = createUseStyles<'light' | 'dark', unknown, Theme>({
  light: oneLight,
  dark: dracula
})

export default usePrismStyles

export { dracula, oneLight }
