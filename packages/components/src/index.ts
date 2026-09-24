import {
  collection,
  fields,
  type ComponentSchema,
} from '@orclickag/keystatic-core';

export type LibraryTemplate = {
  label: string;
  schema: Record<string, ComponentSchema>;
};

export type ComponentLibraryTemplates = {
  components: Record<string, LibraryTemplate>;
  features: Record<string, LibraryTemplate>;
  menus: Record<string, LibraryTemplate>;
  footers: Record<string, LibraryTemplate>;
};

export type ComponentLibraryPaths = Partial<{
  components: `${string}/*`;
  feature: `${string}/*`;
  links: `${string}/*`;
  menus: `${string}/*`;
  footers: `${string}/*`;
}>;

export type ComponentLibraryOptions = {
  templates: ComponentLibraryTemplates;
  paths?: ComponentLibraryPaths;
};

export type LibraryLink = {
  title: string;
  icon?: string | null;
  link: string;
  newTab?: boolean | null;
};

const requiredText = (label: string, description?: string) =>
  fields.text({ label, description, validation: { isRequired: true } });

const slugName = (label: string) =>
  fields.slug({ name: { label, validation: { isRequired: true } } });

function templateField(
  label: string,
  templates: Record<string, LibraryTemplate>
) {
  const entries = Object.entries(templates);
  if (!entries.length) {
    throw new Error(
      `At least one ${label.toLowerCase()} template is required.`
    );
  }

  return fields.conditional(
    fields.select({
      label: 'Modelo',
      options: entries.map(([value, template]) => ({
        label: template.label,
        value,
      })),
      defaultValue: entries[0][0],
    }),
    Object.fromEntries(
      entries.map(([name, template]) => [name, fields.object(template.schema)])
    )
  );
}

/**
 * Creates standard block-library collections. The consuming app owns every
 * component, feature, menu and footer schema through `templates`.
 */
export function createComponentLibraryCollections({
  templates,
  paths: customPaths = {},
}: ComponentLibraryOptions) {
  const paths = {
    components: customPaths.components ?? 'src/content/components/*',
    feature: customPaths.feature ?? 'src/content/features/*',
    links: customPaths.links ?? 'src/content/library/links/*',
    menus: customPaths.menus ?? 'src/content/library/menus/*',
    footers: customPaths.footers ?? 'src/content/library/footers/*',
  };

  return {
    components: collection({
      label: 'Componentes',
      path: paths.components,
      format: { data: 'yaml' },
      slugField: 'name',
      columns: ['name'],
      schema: {
        name: slugName('Nome interno'),
        component: templateField('Componente', templates.components),
      },
    }),
    feature: collection({
      label: 'Features',
      path: paths.feature,
      format: { data: 'yaml' },
      slugField: 'name',
      columns: ['name'],
      schema: {
        name: slugName('Nome interno'),
        feature: templateField('Feature', templates.features),
      },
    }),
    links: collection({
      label: 'Links',
      path: paths.links,
      format: { data: 'yaml' },
      slugField: 'title',
      columns: ['title', 'link'],
      schema: {
        title: slugName('Título'),
        icon: fields.text({ label: 'Ícone' }),
        link: requiredText(
          'Link',
          'Aceita caminhos internos, URLs, mailto: e tel:.'
        ),
        newTab: fields.checkbox({
          label: 'Abrir em nova aba',
          defaultValue: false,
        }),
      },
    }),
    menus: collection({
      label: 'Menus',
      path: paths.menus,
      format: { data: 'yaml' },
      slugField: 'name',
      columns: ['name'],
      schema: {
        name: slugName('Nome interno'),
        menu: templateField('Menu', templates.menus),
      },
    }),
    footers: collection({
      label: 'Rodapés',
      path: paths.footers,
      format: { data: 'yaml' },
      slugField: 'name',
      columns: ['name'],
      schema: {
        name: slugName('Nome interno'),
        footer: templateField('Rodapé', templates.footers),
      },
    }),
  };
}

export function resolveLibraryLink(link: LibraryLink) {
  return {
    href: link.link,
    ...(link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
  };
}
