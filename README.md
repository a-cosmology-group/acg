# Format of the ACG Website


## Navigation structure of the ACG website [just-the-docs](https://just-the-docs.com/):

├─ A Cosmology Group
├─ ACG Newsletters
├─ Essays
│  ├─ [essay-1] ...
├─ Cosmological Models
│  ├─ Changing Radial Distance
│  │  ├─ [model-1] ...
│  ├─ Tired-light Redshift
│  │  ├─ [model-1] ...
│  ├─ Non-Expanding
│  │  ├─ [model-1] ...
├─ Redshift Models
│  ├─ [model-1] ...
├─ Resources
│  ├─ [resource-1] ...
├─ Code
│  ├─ [code-1] ...
├─ Conferences
│  ├─ CCC-1
│  ├─ CCC-2
│  ├─ [conference-N] ...
├─ ACG Organization


## Corresponding **folder** structure in `a-cosmology-group/acg` repo:

├─ index.md
├─ newsletters
│  ├─ [index.md] [acg-newsletter.pdf] ...
├─ essays
│  ├─ [index.md]
│  ├─ [author_a]
│  │  ├─ [index.md] [essay.md] [essay.pdf] ...
│  ├─ [author_b] ...
├─ models
│  ├─ [index.md]
│  ├─ [model-1]
│  │  ├─ [index.md] [model.md] [model.pdf] ...
│  ├─ [model-2] ...
├─ redshift
│  ├─ [index.md]
│  ├─ [model-1]
│  │  ├─ [index.md] [model.md] [model.pdf] ...
│  ├─ [model-2] ...
├─ resources
│  ├─ [index.md]
│  ├─ [author_a]
│  │  ├─ [index.md] [resource.md] [resource.pdf] ...
│  ├─ [author_b] ...
├─ code
│  ├─ [index.md]
│  ├─ [author_a]
│  │  ├─ [index.md] [code.md] [code...]
│  ├─ [author_b] ...
├─ conferences
│  ├─ [index.md]
│  ├─ CCC-1
│  │  ├─ [index.md]
│  ├─ CCC-2
│  │  ├─ [index.md]
│  ├─ [conference-N] ...
├─ org
│  ├─ [index.md]


## YAML headers

`index.md`
```
---
title: A Cosmology Group
layout: home
nav_order: 1
---
```

`newsletter/index.md`
```
---
title: ACG Newsletters
layout: default
nav_order: 2
---
```

`essays/index.md`
```
---
title: Essays
layout: default
nav_order: 3
has_children: true
---
  ---
  title: Open Letter to the Scientific Community
  layout: default
  nav_order: 1
  parent: Essays
  ---
  ---
  title: [Essay 2]
  layout: default
  nav_order: 49
  parent: Essays
  ---
```

`models/index.md`
```
---
title: Cosmological Models
layout: default
nav_order: 4
has_children: true
---
  ---
  title: [Cosmological Model 1]
  layout: default
  parent: Cosmological Models
  nav_order: 174
  ---
```

`redshift/index.md`
```
---
title: Redshift Models
layout: default
nav_order: 5
has_children: true
---
```

`resources/index.md`
```
---
title: Resources
layout: default
nav_order: 6
has_children: true
---
  ---
  title: [Resource 1]
  layout: default
  nav_order: 146
  parent: Resources
  ---
```

`code/index.md`
```
---
title: Cosmology Code
layout: default
nav_order: 7
has_children: true
---
  ---
  title: [Cosmology Code 1]
  layout: default
  nav_order: 172
  parent: Cosmology Code
  ---
```

`conferences/index.md`
```
---
title: Conferences
layout: default
nav_order: 8
---
  ---
  title: CCC-1 2005 Conference
  layout: default
  nav_order: 1
  parent: Conferences
  ---
  ---
  title: CCC-2 2008 Conference
  layout: default
  nav_order: 2
  parent: Conferences
  ---
  ---
  title: [Conference 3]
  layout: default
  nav_order: 3
  parent: Conferences
  ---
```

`org/index.md`
```
---
title: ACG Organization
layout: default
nav_order: 9
---
```
