# features/$module$

Estrutura dos arquivos deste módulo seguindo o guideline por features.

- components/: componentes específicos da publicação
- modal/: modais específicos da publicação
- schema/: esquemas de validação (ex.: Zod)
- services/: Utilização do react query. queries.ts ; api.ts ; mutations.ts ; index.ts

- components/ -> Deve seguir o padrão de nomenclatura $module$-$component-name$.tsx
- modal/ -> Deve seguir o padrão de nomenclatura modal-$module$-$action$.tsx
