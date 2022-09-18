/* eslint-disable simple-import-sort/imports */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-expressions */
import Prism from 'prismjs'
import 'prismjs/plugins/autoloader/prism-autoloader'

Prism.manual = true
Prism.plugins.autoloader.languages_path =
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/'

/* PrismJS 1.29.0
https://prismjs.com/download.html#themes=prism&languages=markup+css+clike+javascript+c+csharp+cpp+go+java+kotlin+markup-templating+perl+php+powershell+python+jsx+tsx+rescript+ruby+rust+swift+typescript */
export default Prism
