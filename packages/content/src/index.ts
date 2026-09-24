import { collection, fields, singleton } from '@orclickag/keystatic-core';
import {
  pageBuilderField,
  type PageBuilderFieldOptions,
} from '@orclickag/keystatic-page-builder';

export type ContentType = 'page' | 'product' | 'service';
export type CatalogType = 'catalog' | 'tag' | 'category';

export type ContentBlockReference =
  | { discriminant: 'imageCta'; value: string }
  | { discriminant: 'features'; value: string };

export type ContentLibraryEntry =
  | {
      discriminant: 'faq';
      value: { items: Array<{ question: string; answer: string }> };
    }
  | {
      discriminant: 'testimonial';
      value: {
        quote: string;
        author: {
          name: string;
          profession?: string | null;
          company?: string | null;
        };
      };
    }
  | {
      discriminant: 'author';
      value: { profession?: string | null; biography?: string | null };
    };

export type ContentLibraryPaths = Partial<{
  pages: `${string}/*`;
  blogPosts: `${string}/*`;
  catalogs: `${string}/*`;
  libraryEntries: `${string}/*`;
  branches: `${string}/*`;
}>;

export type ContentLibraryOptions = {
  paths?: ContentLibraryPaths;
  previewBaseUrl?: string;
  mediaLibraryPath?: string;
  pageBuilder?: PageBuilderFieldOptions;
};

const requiredText = (label: string, description?: string) =>
  fields.text({ label, description, validation: { isRequired: true } });

const slugName = (label: string, description?: string) =>
  fields.slug({
    name: { label, description, validation: { isRequired: true } },
  });

const imageField = (label: string) =>
  fields.object(
    {
      src: fields.url({ label: 'URL da imagem' }),
      alt: fields.text({ label: 'Texto alternativo' }),
    },
    { label }
  );

const mediaField = () =>
  fields.conditional(
    fields.select({
      label: 'Tipo de mídia',
      options: [
        { label: 'Imagem', value: 'image' },
        { label: 'Vídeo', value: 'video' },
      ],
      defaultValue: 'image',
    }),
    {
      image: imageField('Imagem'),
      video: fields.object({
        src: fields.url({ label: 'URL do vídeo' }),
        poster: imageField('Capa'),
      }),
    }
  );

const branchField = () =>
  fields.relationship({
    label: 'Filial',
    description: 'Filial responsável por este conteúdo.',
    collection: 'branches',
    validation: { isRequired: true },
  });

const seoFields = () => ({
  title: slugName(
    'Título SEO',
    'Título exibido nos buscadores e na aba do navegador.'
  ),
  description: fields.text({
    label: 'Descrição SEO',
    description:
      'Resumo para mecanismos de busca e compartilhamentos. Máximo de 160 caracteres.',
    multiline: true,
    validation: { isRequired: true, length: { max: 160 } },
  }),
  keywords: fields.array(
    fields.relationship({ label: 'Palavra-chave', collection: 'catalogs' }),
    {
      label: 'Palavras-chave SEO',
      itemLabel: props => props.value || 'Selecionar palavra-chave',
    }
  ),
  image: imageField('Imagem social'),
  metrics: fields.object(
    {
      priority: fields.number({
        label: 'Prioridade',
        defaultValue: 0.5,
        step: 0.1,
        validation: { isRequired: true, min: 0.1, max: 1 },
      }),
      ratingValue: fields.number({
        label: 'Nota média',
        defaultValue: 4.5,
        step: 0.1,
        validation: { isRequired: true, min: 4.5, max: 5 },
      }),
      reviewCount: fields.integer({
        label: 'Nº avaliações',
        defaultValue: 0,
        validation: { isRequired: true, min: 0 },
      }),
    },
    { label: 'Métricas', layout: [4, 4, 4], preserveLayoutOnNarrow: true }
  ),
  branch: branchField(),
});

const pricingField = () =>
  fields.conditional(
    fields.select({
      label: 'Tipo de produto ou serviço',
      options: [
        { label: 'Simples', value: 'simple' },
        { label: 'Variável', value: 'variable' },
        { label: 'Intervalo de preço', value: 'priceRange' },
      ],
      defaultValue: 'simple',
      width: 'full',
    }),
    {
      simple: fields.object({
        price: fields.number({
          label: 'Preço (R$)',
          step: 0.01,
          validation: { min: 0 },
        }),
      }),
      variable: fields.object({
        attributes: fields.array(
          fields.object({
            name: requiredText('Nome do atributo'),
            options: fields.array(fields.text({ label: 'Opção' }), {
              label: 'Opções',
            }),
          }),
          { label: 'Atributos' }
        ),
        variants: fields.array(
          fields.object({
            name: requiredText('Nome da variação'),
            sku: fields.text({ label: 'SKU' }),
            price: fields.number({
              label: 'Preço (R$)',
              step: 0.01,
              validation: { min: 0 },
            }),
          }),
          { label: 'Variações' }
        ),
      }),
      priceRange: fields.object({
        minPrice: fields.number({
          label: 'Mínimo (R$)',
          step: 0.01,
          validation: { min: 0 },
        }),
        maxPrice: fields.number({
          label: 'Máximo (R$)',
          step: 0.01,
          validation: { min: 0 },
        }),
      }),
    }
  );

const componentReferencesField = () =>
  fields.blocks(
    {
      imageCta: {
        label: 'Componente',
        schema: fields.relationship({
          label: 'Componente',
          collection: 'components',
        }),
      },
      features: {
        label: 'Features',
        schema: fields.relationship({
          label: 'Features',
          collection: 'feature',
        }),
      },
    },
    { label: 'Blocos de conteúdo' }
  );

const catalogRelationsField = () =>
  fields.blocks(
    {
      catalog: {
        label: 'Catálogo',
        schema: fields.relationship({
          label: 'Catálogo',
          collection: 'catalogs',
        }),
      },
      tag: {
        label: 'Tag',
        schema: fields.relationship({ label: 'Tag', collection: 'catalogs' }),
      },
      category: {
        label: 'Categoria',
        schema: fields.relationship({
          label: 'Categoria',
          collection: 'catalogs',
        }),
      },
    },
    { label: 'Relações de catálogo' }
  );

const libraryEntryField = () =>
  fields.conditional(
    fields.select({
      label: 'Tipo',
      options: [
        { label: 'FAQ', value: 'faq' },
        { label: 'Depoimento', value: 'testimonial' },
        { label: 'Autor', value: 'author' },
      ],
      defaultValue: 'faq',
    }),
    {
      faq: fields.object({
        items: fields.array(
          fields.object({
            question: requiredText('Pergunta'),
            answer: fields.mdx.inline({
              label: 'Resposta',
              options: { image: false },
            }),
          }),
          { label: 'Perguntas e respostas', validation: { length: { min: 1 } } }
        ),
      }),
      testimonial: fields.object({
        quote: fields.mdx.inline({
          label: 'Depoimento',
          options: { image: false },
        }),
        author: fields.object({
          name: requiredText('Nome'),
          profession: fields.text({ label: 'Cargo' }),
          company: fields.text({ label: 'Empresa' }),
          photo: imageField('Foto'),
        }),
      }),
      author: fields.object({
        profession: fields.text({ label: 'Cargo ou profissão' }),
        biography: fields.mdx.inline({
          label: 'Biografia',
          options: { image: false },
        }),
        photo: imageField('Foto'),
      }),
    }
  );

/**
 * Creates the Fitinox-derived content and settings collections. The generated
 * page and catalog schemas expect createComponentLibraryCollections() too.
 */
export function createContentCollections(options: ContentLibraryOptions = {}) {
  const paths = {
    pages: options.paths?.pages ?? 'src/content/pages/*',
    blogPosts: options.paths?.blogPosts ?? 'src/content/blog/*',
    catalogs: options.paths?.catalogs ?? 'src/content/catalogs/*',
    libraryEntries:
      options.paths?.libraryEntries ?? 'src/content/library/entries/*',
    branches: options.paths?.branches ?? 'src/content/settings/branches/*',
  };
  const previewBaseUrl = options.previewBaseUrl?.replace(/\/$/, '');

  return {
    pages: collection({
      label: 'Páginas',
      path: paths.pages,
      entryLayout: 'content',
      format: { data: 'yaml', contentField: 'builder' },
      slugField: 'title',
      columns: ['title', 'branch'],
      ...(previewBaseUrl
        ? { previewUrl: `${previewBaseUrl}/preview/{slug}` }
        : {}),
      schema: {
        ...seoFields(),
        type: fields.select({
          label: 'Tipo',
          options: [
            { label: 'Página', value: 'page' },
            { label: 'Produto', value: 'product' },
            { label: 'Serviço', value: 'service' },
          ],
          defaultValue: 'page',
          width: 'full',
        }),
        pricing: pricingField(),
        parentPage: fields.relationship({
          label: 'Página pai',
          collection: 'pages',
        }),
        catalogRelations: catalogRelationsField(),
        builder: pageBuilderField(options.pageBuilder),
      },
    }),
    blogPosts: collection({
      label: 'Blogs',
      path: paths.blogPosts,
      entryLayout: 'content',
      format: { contentField: 'body' },
      slugField: 'title',
      columns: ['title', 'branch', 'pubDate'],
      ...(previewBaseUrl
        ? { previewUrl: `${previewBaseUrl}/blog/{slug}` }
        : {}),
      schema: {
        ...seoFields(),
        heroImage: imageField('Imagem social'),
        pubDate: fields.datetime({
          label: 'Data de publicação',
          defaultValue: { kind: 'now' },
          validation: { isRequired: true },
        }),
        updatedDate: fields.datetime({ label: 'Data de atualização' }),
        body: fields.markdoc({ label: 'Conteúdo' }),
      },
    }),
    catalogs: collection({
      label: 'Catálogos',
      path: paths.catalogs,
      entryLayout: 'content',
      format: { data: 'yaml', contentField: 'paragraph' },
      slugField: 'title',
      columns: ['title', 'type', 'branch'],
      ...(previewBaseUrl
        ? { previewUrl: `${previewBaseUrl}/catalogos/{slug}` }
        : {}),
      schema: {
        type: fields.select({
          label: 'Tipo',
          options: [
            { label: 'Catálogo', value: 'catalog' },
            { label: 'Tag', value: 'tag' },
            { label: 'Categoria', value: 'category' },
          ],
          defaultValue: 'catalog',
          validation: { isRequired: true },
        }),
        ...seoFields(),
        tags: fields.array(
          fields.relationship({ label: 'Tag', collection: 'catalogs' }),
          {
            label: 'Tags',
            itemLabel: props => props.value || 'Selecionar tag',
          }
        ),
        paragraph: fields.markdoc({ label: 'Parágrafo' }),
        media: mediaField(),
        icon: fields.text({ label: 'Ícone' }),
        components: componentReferencesField(),
      },
    }),
    libraryEntries: collection({
      label: 'Biblioteca',
      path: paths.libraryEntries,
      format: { data: 'yaml' },
      slugField: 'name',
      columns: ['name', 'branch'],
      schema: {
        name: slugName('Nome ou identificação'),
        branch: branchField(),
        content: libraryEntryField(),
      },
    }),
    branches: collection({
      label: 'Filiais',
      path: paths.branches,
      format: { data: 'yaml' },
      slugField: 'name',
      columns: ['name', 'region', 'locale', 'isDefault'],
      schema: {
        name: slugName('Nome'),
        location: fields.object({
          coordinates: fields.object({
            lat: fields.number({ label: 'Latitude', defaultValue: 0 }),
            lng: fields.number({ label: 'Longitude', defaultValue: 0 }),
            zoom: fields.integer({ label: 'Zoom', defaultValue: 14 }),
          }),
          address: fields.text({ label: 'Endereço', multiline: true }),
          googleMapsLink: fields.url({ label: 'Link Google Maps' }),
          googleMapsIframe: fields.url({ label: 'Link iFrame Google Maps' }),
        }),
        region: requiredText('Região', 'Exemplo: BR'),
        locale: requiredText('Locale', 'Exemplo: pt-BR'),
        contacts: fields.blocks(
          {
            email: {
              label: 'Email',
              schema: fields.relationship({
                label: 'Link',
                collection: 'links',
              }),
            },
            phone: {
              label: 'Telefone',
              schema: fields.relationship({
                label: 'Link',
                collection: 'links',
              }),
            },
            whatsapp: {
              label: 'WhatsApp',
              schema: fields.relationship({
                label: 'Link',
                collection: 'links',
              }),
            },
          },
          { label: 'Contatos' }
        ),
        mainMenu: fields.relationship({
          label: 'Menu principal',
          collection: 'menus',
        }),
        mainFooter: fields.relationship({
          label: 'Rodapé principal',
          collection: 'footers',
        }),
        microsoftClarityId: fields.text({ label: 'Microsoft Clarity ID' }),
        googleTagManagerId: fields.text({ label: 'Google Tag Manager ID' }),
        metaPixelId: fields.text({ label: 'Meta Pixel ID' }),
        seo: fields.object({
          siteName: fields.text({ label: 'Nome do site' }),
          author: fields.text({ label: 'Autor institucional' }),
          applicationName: fields.text({ label: 'Nome da aplicação' }),
          twitterSite: fields.text({ label: 'Perfil do site no X/Twitter' }),
          twitterCreator: fields.text({ label: 'Criador no X/Twitter' }),
          themeColor: fields.text({ label: 'Cor do tema' }),
        }),
        identity: fields.object({
          badgeLogoLight: imageField('Badge logo clara'),
          badgeLogoDark: imageField('Badge logo escura'),
          logoLight: imageField('Logo clara'),
          logoDark: imageField('Logo escura'),
        }),
        isDefault: fields.checkbox({
          label: 'Filial padrão',
          defaultValue: false,
        }),
      },
    }),
  };
}

/**
 * Creates the media-library singleton used by the standard Mídia navigation
 * section. Apps can replace its UI while retaining this stored data contract.
 */
export function createContentSingletons(options: ContentLibraryOptions = {}) {
  return {
    mediaLibrary: singleton({
      label: 'Biblioteca de mídia',
      path: options.mediaLibraryPath ?? 'src/content/settings/media-library',
      format: { data: 'yaml' },
      schema: {
        items: fields.array(
          fields.object({
            title: requiredText('Título'),
            kind: fields.select({
              label: 'Tipo',
              options: [
                { label: 'Imagem', value: 'image' },
                { label: 'Vídeo', value: 'video' },
              ],
              defaultValue: 'image',
            }),
            url: fields.url({ label: 'URL', validation: { isRequired: true } }),
            alt: fields.text({ label: 'Texto alternativo' }),
          }),
          {
            label: 'Arquivos',
            itemLabel: props => props.fields.title.value || 'Novo arquivo',
          }
        ),
      },
    }),
  };
}
