module.exports = (app) => {

    app.all('*', (req, res) => {
        res.status(404).render('error', {
            statusCode: 404,
            statusMessage: 'Not Found',
            statusImageUrl: 'http://clipart-library.com/new_gallery/843798_sad-smileys-png.png'
        })
    })

}