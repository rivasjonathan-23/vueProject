import Vue from "vue";
import Router from "vue-router";
import store from "./store";
import Home from "@/authentication/home.vue";
import login from "@/authentication/Login.vue";
import FullSignUp from "@/authentication/fullSignUp.vue";
import OrgSignUp from "@/authentication/orgSignUp.vue";
import TypeOfUser from "@/authentication/typeOfUser.vue";
import userpage from "@/views/Userpage.vue";
import orgpage from "@/views/Organizationpage.vue";


import orgeditprofile from "@/modules/organization/orgeditprofile.vue"
import Userprofile from "@/modules/user/usereditprofile.vue"
import UserBadgelist from "./modules/user/Mybadge.vue";

import badges from "./modules/organization/Badges.vue";
import certify from "./modules/organization/Certify.vue";
import Redirect from './views/redirect.vue';

Vue.use(Router);


let router = new Router({
  mode: "history",

  routes: [{
    path: "/",
    component: Home,
    beforeEnter(to, from, next) {
      if (store.getters.isLoggedIn) {
        store.dispatch("identifyUser").then((data) => {
          if (data) {
            next("/user");
          } else {
            next("/organization");
          }
        })
      } else {
        next();
      }
    },
  },
  {
    path: "/viewuser/:username",
    name: "viewuser",
    component: Redirect,
    props: true
  },


  {
    path: "/login",
    component: login,
    beforeEnter(to, from, next) {
      if (!store.getters.isLoggedIn) {
        next();
      } else {
        next("/");
      }
    },
  },

  {
    path: "/org_edit_profile",
    component: orgeditprofile,
    beforeEnter(to, from, next) {
      if (store.getters.isLoggedIn) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/user_edit_profile",
    component: Userprofile,
    beforeEnter(to, from, next) {
      if (store.getters.isLoggedIn) {
        next();
      } else {
        next("/login");
      }
    },
  },


  {
    path: "/signUpAs",
    component: TypeOfUser,
    beforeEnter(to, from, next) {
      if (!store.getters.isLoggedIn) {
        next();
      } else {
        next("/");
      }
    },
    children: [
      {
        path: "organization",
        component: OrgSignUp
      },
      {
        path: "",
        component: FullSignUp
      }
    ]
  },
  {
    path: "/user",
    component: userpage,
    beforeEnter(to, from, next) {
      if (store.getters.isLoggedIn) {
        store.dispatch("identifyUser").then((data) => {
          if (data) {
            next();
          } else {
            next("/login");
          }
        })
      } else {
        next("/login");
      }
    },
    children: [
      {
        path: "",
        component: UserBadgelist,
      },
      {
        path: "updateprofile",
        component: FullSignUp,
      }
    ]
  },
  {
    path: "/organization",
    component: orgpage,

    beforeEnter(to, from, next) {
      if (store.getters.isLoggedIn) {
        store.dispatch("identifyUser").then((data) => {
          if (!data) {
            next();
          } else {
            next("/login");
          }
        })
      } else {
        next("/login");
      }
    },
    children: [
      {
        path: "",
        component: badges,
      },
      {
        path: "certify",
        component: certify
      },
      {
        path: "updateprofile",
        component: OrgSignUp,
      }
    ]
  },
  ]
})

export default router
