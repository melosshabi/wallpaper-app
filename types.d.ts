type ComponentProps = {
    Home:{
        photos:Array
    } | undefined
    WallpaperDetails:{
        wallpaperUrl:string,
        navigatedFromProfile:boolean,
    },
    SearchResults:{
        searchedPhotos:Array,
    }
    SignUp:undefined
    SignIn:undefined
    Settings:undefined
    Profile:undefined
}
type FavoriteWallpapers = {
    userId:string,
    photoUrl:string,
    username:string,
    // id refers to the document Id on the database
    id:string
}