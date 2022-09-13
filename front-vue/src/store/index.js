import {createStore} from 'vuex';
import axios from 'axios';
import { Cloudinary } from "@cloudinary/url-gen";
import { fill} from "@cloudinary/url-gen/actions/resize";
// import {byRadius} from "@cloudinary/url-gen/actions/roundCorners";
// import {focusOn} from "@cloudinary/url-gen/qualifiers/gravity";
// import {FocusOn} from "@cloudinary/url-gen/qualifiers/focusOn";
const router=require('../router')
export default createStore({
    state:{
        dataToken:null,
        user:{
            role:'anonyme'
        },
        styles:[],
        hasNotif:false,
        cities:[],
        requestObj:{},
        url:null
    },
    mutations:{
        async check(state,data){
            
            state.dataToken=await data;
        },
        getUser(state,user){
            state.user=user;
        },
        getAllStyles(state,styles){
            state.styles=styles;
        },
        getAllCities(state,cities){
            state.cities=cities;
        },
        createRequestObjForCloudinary(state,requestObj){
            state.requestObj=requestObj;
        },
        resetRequestObj(state){
            state.requestObj={};
        },
        deleteUser(state){
            state.user={};
        },
        setAnonymous(state){
            state.user.role="anonyme";
            state.dataToken=null;
        },
        transformImg(state,url){
            state.url=url;
        },
        setNotifDashboard(state,hasNotif){
            state.hasNotif=hasNotif;
        }
    },
    actions:{
        async setAnonymous({commit}){
            commit('setAnonymous')
        },
        async check({commit}){
            const response=await axios.get(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}checkRole`);
            commit('check',response.data)        
        },
        async getUser({dispatch,commit}){
            try {           
                await dispatch('check');
                let response;
                if(this.state.dataToken.role==='pro')
                    response=await axios.get(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/pro/${this.state.dataToken.id}`);
                else if(this.state.dataToken.role==='consumer')
                    response=await axios.get(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/consumer/${this.state.dataToken.id}`);
                
                commit('getUser',response.data)
            } catch (error) {
                dispatch('setAnonymous');
                console.log(error)
            }
        },
        getAllStyles({commit}){
            
            //récupération des styles a afficher dans les balises select
            axios
                .get(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/styles`)
                .then((response)=>{ 
                    commit('getAllStyles',response.data.map((item)=> item.name).sort());
                })
                .catch(err=>{
                
                })
        },
        async transformImg({commit},img){
            const cld = new Cloudinary({
                cloud: {
                    cloudName: process.env.VUE_APP_ENV_CLOUDINARY_CLOUDNAME,
                    apiKey:process.env.VUE_APP_ENV_CLOUDINARY_APIKEY,
                    apiSecret:process.env.VUE_APP_ENV_CLOUDINARY_APISECRET
                }
            }); 
            
            const myImage = cld.image(img.public_id);
            
            myImage
                .resize(fill().width(300).height(300));
            const url=myImage.toURL();
            await commit('transformImg',url);

        },
        getAllCities({commit}){
            //récupération des styles a afficher dans les balises select
            axios
                .get(`${process.env.VUE_APP_ENV_ENDPOINT_BACK}api/cities`)
                .then((response)=>{ 
                    commit('getAllCities',this.cities=response.data[0].map((item)=> item.city).sort());

                })
                .catch(err=>{

                })
        },
        createRequestObjForCloudinary({commit},event){   
            let reader=new FileReader();
            let clientFile;
            reader.addEventListener("load", ()=>{
                clientFile=reader.result;
                console.log(clientFile);
                let requestObj={
                    url:process.env.VUE_APP_ENV_CLOUDINARY_UPLOAD_URL,
                    method:"POST",
                    data:{upload_preset:process.env.VUE_APP_ENV_CLOUDINARY_PRESET,file:clientFile}
                }
                commit('createRequestObjForCloudinary',requestObj); 
            })

            reader.readAsDataURL(event.target.files[0]);
        },
        deleteUser({commit}){
            commit('deleteUser');
        },
        resetRequestObj({commit}){
            commit('resetRequestObj');
        },
        async logout({dispatch,commit}){
            //suppression du Token
            localStorage.removeItem("token");
            //suppression du header Authorization(le back ne reconnaitra plus l'utilisateur )
            delete axios.defaults.headers.common['Authorization'];
            //mise à jour de user.role à anonyme
            await dispatch('deleteUser');
            await dispatch('setAnonymous');
            console.log(router)
            router.default.push('/'); 

        },
        setNotifDashboard({commit},data){
            commit('setNotifDashboard',data.active);
        },
        handleUploadToCloudinary({commit}){
            let instance = axios.create();
            delete instance.defaults.headers.common['Authorization'];
            console.log(this.state.requestObj)
            
            let img=instance(this.state.requestObj)
                .then((response) => {
                    return response.data; 
                })
                .catch(err=>{
                    return err;
                })
            return img;
            
        }



    },
    modules:{

    }
})

