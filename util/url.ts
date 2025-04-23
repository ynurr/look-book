export const URLS = {
    home: '/home',
    login: '/login',
    signup: '/signup',
    loginWithCallback: (path: string) => `/login?callbackUrl=${encodeURIComponent(path)}`,
    popular: '/popular',
    new: '/new',
    book: {
        bookDetail: (isbn13: string) => `/detail?id=${isbn13}`,
    },
    library: {
        libraryHome: '/library',
        reading: '/library/reading',
        readingDetail: (isbn: string) => `/library/reading/detail?isbn=${isbn}`,
        wishlist: '/library/wishlist',
        myReview: '/library/my-review',
        comment: '/library/comment',
        like: '/library/like',
        inquiry: '/library/inquiry',
        inquiryHistory: '/library/inquiry/history',
        inquiryDetail: (id: string) => `/library/inquiry/history/detail?id=${id}`
    },
    review: {
        write: (
            cover: string,
            title: string,
            author: string,
            isbn13: string,
            status: string,
            id?: string
        ) => {
            let url = `/write/review?cover=${encodeURIComponent(cover)}&title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&isbn13=${encodeURIComponent(isbn13)}&status=${encodeURIComponent(status)}`
            if (id) {
                url += `&id=${encodeURIComponent(id)}`
            }
            return url
        }
    },
    profile: {
        edit: '/profile/edit'
    },
    account: {
        modify: '/account/modify',
        leave: '/account/leave'
    },
    find: {
        findId: '/find/id',
        findPassword: '/find/password'
    },
    terms: {
        service: '/terms/service-terms',
        privacy: '/terms/privacy-policy'
    },
    admin: {
        inquiry: '/admin/inquiry',
        inquiryDetail: (id : string) => `/admin/inquiry/detail?id=${id}`
    },
}