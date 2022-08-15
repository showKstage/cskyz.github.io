module.exports = {
    title: '翊政的博客',
    description: '记录前端学习日常',
    dest: './dist',
    port: '80',
    head: [['link', { rel: 'icon', href: '/logo.jpg' }]],
    markdown: {
        lineNumbers: true,
    },
    themeConfig: {
        nav: require('./nav.js'),
        sidebar: {
            '/guide/': [
                {
                    title: '新手指南',
                    collapsable: true,
                    children: ['/guide/notes/one'],
                },
                {
                    title: '翊政',
                    collapsable: true,
                    children: ['/guide/notes/two'],
                },
            ],
        },
        sidebarDepth: 2,
        lastUpdated: 'Last Updated',
        searchMaxSuggestoins: 10,
        serviceWorker: {
            updatePopup: {
                message: '有新的内容.',
                buttonText: '更新',
            },
        },
        editLinks: true,
        editLinkText: '在 GitHub 上编辑此页 ！',
    },
};
