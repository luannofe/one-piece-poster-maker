import React, { useEffect} from "react";


export default function App() {
    
    let poster_properties = {name: 'MONKEY D LUFFY', cost: '500.000', img:''}
    


    async function drawCanvas(cv_height = (window.innerHeight * 0.85)) {

        return new Promise(async (resolve, reject) => {
            
            const canvaspar = document.getElementById('poster_canvas')
            const canvas = document.getElementById('poster_canvas').getContext('2d');
            let userimg = await getBase64(document.getElementById('img_input').files[0])
            
            
            //image
            async function createimg(url, heightx = cv_height) {
                return new Promise(async (resolve, reject) => {
    
                    function loadimg() {
                        return new Promise((resolve, reject) => {
                            const img = new Image();
                            img.src = url
                            img.onload = () => {resolve(img)}
                        })
                    }
                    
                    let img = await loadimg()
                    let ratio =  img.naturalWidth / img.naturalHeight
                    let height = heightx;
                    let width = height * ratio;
        
                    
                        resolve(              
                          {  img: img,
                            width : width,
                            ratio: ratio}
                            )
                })
     
            }  
            async function getBase64(file) {

                return new Promise(async (resolve,reject) => {

                    if (file == undefined) {
                        resolve(await createimg('./placeholder.png'))
                    }

                    let reader = new FileReader()
                    reader.readAsDataURL(file)

                    reader.onload = async function () {
                        resolve(await createimg(reader.result))
                    }

                    reader.onerror = async function () {
                        resolve(await createimg('./placeholder.png'))
                    }
                })
            }

            let img = await createimg('./poster_base.png')
            let overlay = await createimg('./overlay_effect.png')


            //canvas settings
            canvas.canvas.height =  cv_height
            canvas.canvas.width = img.width
    
            //desenha a img
            canvas.drawImage(userimg.img,img.width/2-250,80, 500, 500)
            canvas.globalCompositeOperation = 'darken'
            canvas.drawImage(overlay.img,0,0, img.width, cv_height)
            canvas.globalCompositeOperation = 'source-over'
            canvas.drawImage(img.img,0,0, img.width, cv_height)


            //seta estilos do teto
            canvas.textBaseline = 'middle'
            canvas.textAlign = 'center'
            canvas.strokeStyle = 'black'
            canvas.lineWidth = 1

            //gradient
            let gradient = canvas.createConicGradient(90, 288, 333)
            gradient.addColorStop(0.85, "#614230")
            gradient.addColorStop(0.9, "#211202")
            gradient.addColorStop(1, "#614230")
            //gradient.addColorStop(0.7, "#422508")
            canvas.fillStyle = gradient

            //name
            canvas.font = '113px OPFONT';
            canvas.fillText(poster_properties.name, img.width/2, 650)
            canvas.strokeText(poster_properties.name, img.width/2, 650)

            //cost
            canvas.font = '50px OPFONT2'
            canvas.fillText(poster_properties.cost, img.width/2, 730)
            canvas.strokeText(poster_properties.cost, img.width/2, 730)

            //cifrao
            let offspace = canvas.measureText(poster_properties.cost)
            canvas.font = '109px OPFONT'
            canvas.fillText('$',  img.width/2 - (offspace.actualBoundingBoxLeft + 35) , 744)

            //convert to img
            let toimg = await canvaspar.toDataURL("image/png")
            resolve(toimg) 
    
            })
    }  
   

    useEffect(() => {

        drawCanvas().then(img => {
            document.getElementById('image_preview').src = img
        })

        function initPrevImage() { 
            let preview_img = document.getElementById('image_preview')
            let imgheight =  String(window.innerHeight * 0.85) + 'px'
            preview_img.style.height = imgheight

        }
        initPrevImage()

        document.getElementById('preview_button').onclick = async function preview() {
            let nameinput = document.getElementById('name_input')
            let priceinput = document.getElementById('price_input')

            console.log('clicou')

            poster_properties.name = nameinput.innerText.toUpperCase()
            poster_properties.cost = priceinput.innerText

            drawCanvas().then(img => {
                document.getElementById('image_preview').src = img
            })
            
        }

    }, [])

    return (
    <>
        <div className="background">
            <div className="main_container">
                <img id='image_preview' className='canvas_image'  src="./poster_base.png" alt="" />
                <div className="right">
                    <h3>save the image on left</h3>
                    <div className="tools_div">
                        <span className="label">image</span>
                        <input type='file' id="img_input"></input>
                        <span className="label">name</span>
                        <div contentEditable id='name_input' className="name_input">MONKEY D LUFFY</div>
                        <span className="label">price</span>
                        <div contentEditable id='price_input' className="price_input">500,000</div>
                        <button id='preview_button'>Create</button>
                    </div>
                    <div className="icons">
                        <a href="https://github.com/saskickers">
                            <img className="icon1" src="./githubicon.png"></img>
                        </a>
                        <a href="https://www.instagram.com/luannofe/">
                            <img className="icon2" src="./igicon.png"></img>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div className="font_preloader">-
            <span>-</span>
        </div>
         <canvas id='poster_canvas' className="poster_canvas">
        </canvas>
    </>
    )
}

