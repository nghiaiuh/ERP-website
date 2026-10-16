import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

const applicationOnlyImports = [
  {
    name: '@tanstack/react-query',
    message: 'Server state belongs in features or providers, not shared UI.',
  },
  {
    name: '@tanstack/react-query-devtools',
    message: 'React Query devtools belong in the query provider.',
  },
  {
    name: 'next-intl',
    message: 'Translate content before passing it to shared components.',
  },
  {
    name: 'next-intl/server',
    message: 'Translate content before passing it to shared components.',
  },
  {
    name: 'zustand',
    message: 'Application state belongs in features or stores, not shared UI.',
  },
];

const applicationLayerPatterns = [
  {
    group: [
      '@/features/**',
      '@/stores/**',
      '@/lib/api/**',
      '@/lib/query/**',
      '@/providers/**',
    ],
    message: 'Shared UI must not depend on application or business layers.',
  },
  {
    group: [
      '@tanstack/**',
      'next-intl/**',
      'zustand/**',
    ],
    message: 'Shared UI must remain independent from application frameworks.',
  },
];

const motionImports = [
  {
    name: 'gsap',
    message: 'Motion and WebGL are restricted to the marketing layer.',
  },
  {
    name: 'three',
    message: 'Motion and WebGL are restricted to the marketing layer.',
  },
  {
    name: '@react-three/fiber',
    message: 'Motion and WebGL are restricted to the marketing layer.',
  },
  {
    name: '@react-three/drei',
    message: 'Motion and WebGL are restricted to the marketing layer.',
  },
];

const motionPatterns = [
  {
    group: [
      'gsap/**',
      'three/**',
      '@react-three/**',
      '@/components/marketing/motion/**',
      '@/components/marketing/webgl/**',
    ],
    message: 'Motion and WebGL must not enter the ERP application bundle.',
  },
];

const wrappedAntdImports = {
  name: 'antd',
  importNames: [
    'Button',
    'Checkbox',
    'Drawer',
    'Input',
    'Modal',
    'Select',
    'Switch',
    'Table',
  ],
  message: 'Use the corresponding component from @/components/ui or @/components/patterns.',
};

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    files: ['src/design-system/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: applicationOnlyImports,
          patterns: [
            ...applicationLayerPatterns,
            {
              group: ['@/components/**'],
              message: 'Design-system foundations must not depend on React components.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/components/ui/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            ...applicationOnlyImports,
            ...motionImports,
          ],
          patterns: [
            ...applicationLayerPatterns,
            ...motionPatterns,
            {
              group: ['@/components/patterns/**'],
              message: 'UI primitives must not depend on composed patterns.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/components/patterns/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            ...applicationOnlyImports,
            ...motionImports,
          ],
          patterns: [
            ...applicationLayerPatterns,
            ...motionPatterns,
          ],
        },
      ],
    },
  },
  {
    files: [
      'src/app/**/app/**/*.{ts,tsx}',
      'src/features/**/*.{ts,tsx}',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            wrappedAntdImports,
            ...motionImports,
          ],
          patterns: [
            ...motionPatterns,
            {
              group: ['@/features/*/**'],
              message: 'Import a feature through its public index instead of its internals.',
            },
            {
              group: [
                '@/components/ui/*/**',
                '@/components/patterns/*/**',
              ],
              message: 'Import a shared component through its component-level public index.',
            },
            {
              group: [
                'antd/es/button*',
                'antd/lib/button*',
                'antd/es/checkbox*',
                'antd/lib/checkbox*',
                'antd/es/drawer*',
                'antd/lib/drawer*',
                'antd/es/input*',
                'antd/lib/input*',
                'antd/es/modal*',
                'antd/lib/modal*',
                'antd/es/select*',
                'antd/lib/select*',
                'antd/es/switch*',
                'antd/lib/switch*',
                'antd/es/table*',
                'antd/lib/table*',
              ],
              message: 'Do not bypass the shared Ant Design wrappers.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/providers/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: motionImports,
          patterns: motionPatterns,
        },
      ],
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'storybook-static/**',
    'next-env.d.ts',
  ]),
]);
