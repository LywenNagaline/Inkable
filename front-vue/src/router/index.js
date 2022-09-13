import {createRouter,createWebHistory} from 'vue-router';
import Home from '@/views/Home.vue';
import InscriptionPro from '@/views/InscriptionPro.vue';
import InscriptionConsumer from '@/views/InscriptionConsumer.vue';
import Connexion from '@/views/Connexion.vue';
import DashboardPro from '@/views/DashboardPro.vue';
import DashboardParticulier from '@/views/DashboardParticulier.vue';
import ProfilPro from '@/views/ProfilPro.vue';
import FormulaireProject from '@/views/FormulaireProject.vue';
import Project from '@/views/Project.vue';
import CompteParticulier from '@/views/CompteParticulier.vue';
import ComptePro from '@/views/ComptePro.vue';
import Planning from '@/views/Planning.vue';
import Page404 from '@/views/Page404.vue';
import ProjectParticulier from '@/views/ProjectParticulier';
import Createurs from '@/views/Createurs.vue';
import axios from 'axios';
const store = require('../store')
function checkAuthorization(user,id)
{
    
    if(user.role=='anonyme')
        return false;
    let isAuthorized=false;
      
    for (let i = 0; i <user.projects.length; i++) {
        const project = user.projects[i];
      
        if(project.id===id)
        {
            isAuthorized=true;
            break;
        }   
    }
    return isAuthorized;
}
const routes=[
    {
        name:'Home',
        path:'/',
        component: Home,
        meta:{
            roles:['pro', 'consumer','anonyme'],
            breadcrumb:'Accueil'
        }
    },
    {
        name:'DashboardPro',
        path:'/dashboard-pro',
        component: DashboardPro,
        meta:{
            roles:['pro'],
            breadcrumb:'Dashboard'
        }
    },
    {
        name:'InscriptionPro',
        path:'/inscriptionPro',
        component:InscriptionPro,
        meta:{
            roles:['anonyme'],
            breadcrumb:'Inscriptions tatoueur'
        }
    },
    {
        name:'Connexion',
        path:'/connexion',
        component:Connexion,
        meta:{
            roles:['anonyme'],
            breadcrumb:'Connexion'
        }
    },
    {
        name:'InscriptionConsumer',
        path:'/inscriptionConsumer',
        component:InscriptionConsumer,
        meta:{
            roles:['anonyme'],
            breadcrumb:'Inscriptions'
        }
    },
    {
        name:'FormulaireProject',
        path:'/profil-pro/:id(\\d+)/formulaire-project',
        component:FormulaireProject,
        meta:{
            roles:['consumer'],
            breadcrumb:'Formulaire'
        }
    },
    {
        name:'Project',
        path:'/dashboard-pro/project/:id',
        alias:['/planning/project/:id','/project/:id','/dashboard-pro/project/:id/planning/project/:id','/dashboard-pro/planning/project/:id'],
        component:Project,
        meta:{
            roles:['pro'],
            breadcrumb:'Projet'
        }
    },
    {
        name:'ProjectParticulier',
        path:'/dashboard-particulier/project-particulier/:id',
        

        component:ProjectParticulier,
        meta:{
            roles:['consumer'],
            breadcrumb:'Projet'
        }
    },
    {
        name:'ProfilPro',
        path:'/profil-pro/:id(\\d+)',
        component:ProfilPro,
        meta:{
            roles:['pro', 'consumer','anonyme'],
            breadcrumb:'Profil Tatoueur'
        }
    },
    {
        name:'DashboardParticulier',
        path:'/dashboard-particulier',
        component:DashboardParticulier,
        meta:{
            roles:['consumer'],
            breadcrumb:'Dashboard'
        }
    },
    {
        name:'CompteParticulier',
        path:'/compte-particulier',
        component:CompteParticulier,
        meta:{
            roles:['consumer'],
            breadcrumb:'Compte'
        }
    },
    {
        name:'ComptePro',
        path:'/compte-pro',
        component:ComptePro,
        meta:{
            roles:['pro'],
            breadcrumb:'Compte'
        }
    },
    {
        name:'Planning',
        path:'/dashboard-pro/planning/:projectId(\\d+)?',
        alias:['/planning','/dashboard-pro/project/:projectId(\\d+)?/planning'],
        component:Planning,
        meta:{
            roles:['pro'],
            breadcrumb:'Planning'
        }
    },
    // {
    //     name:'Planning',
    //     path:'/planning/:projectId?',
    //     component:Planning,
    //     meta:{
    //         roles:['pro'],
    //         breadcrumb:'Planning'
    //     }
    // },
    {
        name:'NotFound',
        path:'/:pathMatch(.*)*',
        component:Page404,
        meta:{
            roles:['pro', 'consumer','anonyme']

        }
    },
    {
        name:'createurs',
        path:'/createurs',
        component:Createurs,
        meta:{
            roles:['pro', 'consumer','anonyme'],
            breadcrumb:'Créateurs'
        }
    },
    
];

const router=createRouter({
    history:createWebHistory(),
    routes
})


router.beforeEach(async (to,from,next)=>{
    try {
        const token=localStorage.getItem("token");
        //met le token dans le header 
        axios.defaults.headers.common['Authorization']=`Bearer ${token}`
        await store.default.dispatch('getUser');  
        const user=store.default._state.data.user;
        let hasNotif=false;
        user.projects?.forEach(project => {
            if(project.status==='en attente' && user.role==='pro'){hasNotif=true}
            project.notifs?.forEach((notif)=> {
                if(notif.code==='msg_consumer' && user.role==='pro'){hasNotif=true}
                

                if(notif.code!=='msg_consumer'&& user.role==='consumer') {hasNotif=true;}
            });
        })
        await store.default.dispatch('setNotifDashboard',{active:hasNotif});
        console.log("notifs",store.default._state.data.hasNotif);

       

    } catch (error) {
        console.log(error);
    }
    
    
    if(to.name==='Project'||to.name==='ProjectParticulier')
    {
        const isAuthorized=checkAuthorization(store.default._state.data.user,Number(to.params.id));
        if(!isAuthorized)
        {
            return next({
                path:'/404',
            })
        }
    }
    else if(to.name==='Planning')
    {
        let isAuthorized=true;
        console.log(to.params.projectId)
        if(to.params.projectId!== '' && to.params.projectId!== undefined)
            isAuthorized=checkAuthorization(store.default._state.data.user,Number(to.params.projectId));
        if(!isAuthorized)
        {
            return next({
                path:'/404',
            })
        }
    }
    if(to.meta.roles && !to.meta.roles.includes(store.default._state.data.user.role)){
        if(to.name==='FormulaireProject'){
            return next({
                path:'/connexion',
            })   
        }
        return next({
            path:'/',
        })   
    }
    return next();
   
})



export default router;