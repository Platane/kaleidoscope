export const loadImage = ( url: string ) : Promise<HTMLImageElement> =>
    new Promise( (resolve, reject) => {

        const img = document.createElement( 'img' )

        if ( !img )
            reject()

        img.onload = () => resolve( img )
        img.onerror = error => reject( error )

        img.crossOrigin = 'Anonymous'
        img.src = url
    })