<template>
  <div>
    <div id="mybadge">
      <div class="sheader">
        <!-- <span class="tbadge" v-bind:class="{fit: sm}">
          <span>Badges&nbsp;</span>
          <span class="nb">{{badgelist.length}}</span>
        </span> -->

      </div>
      <div id="line"></div>
      <div class="loading" v-show="isLoading">
        <div class="text-center text-danger my-2">
          <b-spinner id="loading2" class="align-middle"></b-spinner>
        </div>
      </div>
      <h3 class="temp" v-show="hasData">You haven't availed badges yet</h3>
      <div v-for="(badge, index) in badgelist" :key="index">
        <b-row v-if="badge.badgeID.granted" class="row" >
          <div class="badgeicon" v-bind:class="{zoomin: resized}" >
            <div class="bpic" v-bind:style='{backgroundImage: `url(${badge.badgeID.imgnum})`}'>
            </div>
            <div class="background">
              <div class="bcontent">
                <img src="@/assets/image2.png" class="blogo">
                <h5 class="binfo">{{ badge.badgeID.badgename }}</h5>
                <p class="binfo">{{ badge.badgeID.venue }}</p>
                <p class="binfo">{{ badge.badgeID.date.month+" "+badge.badgeID.date.day+" "+badge.badgeID.date.year }}</p>
              </div>
            </div>
          </div>
          <div class="cerBody" v-bind:class="{zoomin: resized}">
            <p class="name">
              This certificate of
              <br>
              {{badge.badgeID.certificateName}}
            </p>
            <span>is awarded to</span>
            <h5>{{fullname}}</h5>
            <br>
            <p class="description">{{badge.badgeID.descriptions}}</p>
            <br>
            <p>Given this {{ badge.badgeID.date.month+" "+badge.badgeID.date.day+", "+badge.badgeID.date.year }}</p>
            <div class="text-center byorg">
              <h5>Given by {{badge.badgeID.organization}}</h5>
            </div>
          </div>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import $ from "jquery";
import { userInfo } from "os";

export default {
  name: "Badges",
  props: {
    userInfo: Object,
    id: String,
    fullname: String
  },
  data() {
    return {
      badgelist: [],
      badgeCode: "",
      hasData: false,
      error: false,
      availing: false,
      size: 0,
      resized: false,
      isLoading: false,
      sm: false,
      pressed: true
    };
  },
  methods: {
    reset() {
      this.error = false;
      this.badgeCode = "";
      $(".binput").css({ "border-color": "gray" });
    },
    handleResize() {
      if (window.innerWidth < 900) {
        this.resized = true;
        if (window.innerWidth < 600) {
          this.sm = true;
        } else {
          this.sm = false;
        }
      } else {
        this.sm = false;
        this.resized = false;
      }
    }
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  created() {
    this.$emit("badgeCount", this.badgelist.length);
    window.addEventListener("resize", this.handleResize);
    this.size = window.innerWidth;
    this.handleResize();
    axios
      .post("http://localhost:8081/user/view-userbadges", {
        id: this.id
      })
      .then(res => {
        this.isLoading = false;
        this.badgelist = res.data.badges.reverse();
        if (this.badgelist.length == 0) {
          this.hasData = true;
        }
        var num = 0;
        this.$emit("badgeCount", this.badgelist.length);
        this.by3Data = [];
        this.temp = res.data.badges.reverse();
        this.temp.forEach(element => {
          if (element.badgeID.granted) {
            element.badgeID["imgnum"] = `http://localhost:8081/static/${element.badgeID.backgroundImg}`;
            num += 1;
            if (num > 10) {
              num = 0;
            }
            this.by3Data.push(element);
          }
        });
      });
  }
};
</script>
<style scoped>
.bl {
  margin-right: 0;
  margin-left: 0;
 padding-right: 5px;
  padding-left: 5px;

}

.br {
  margin-left: 0;
  margin-right: 0;
  padding-left: 5px;
  padding-right: 5px;

}
.nb {
  padding-left: 7px;
  padding-right: 7px;
  padding-top: 3px;
  padding-bottom: 3px;
  background: #d1e2e6;
  border-radius: 5px;
  font-size: 20px;
}

.cerBody {
  width: 59%;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 30px;
  padding-bottom: 20px;
  color: #3d4c54;
  background: #e8f3fa;
  text-align: center;
  font-family: Verdana;
  font-size: 16px;
  height: 390px;
  border-right:6px solid #779cb5;
  border-bottom:8px solid #e8f3fa;
}
.btnrow {
  background: white;
  padding: 0;
}
.blogo {
  margin-top: 30px;
  width: 200px;
}

.btn:focus {
  outline: none;
}

.name {
  font-size: 18px;
}

.row {
  margin-right: 10px;
  margin-left: 10px;
  margin-top: 25px;
  padding: 0;
  margin-bottom: 25px;
  background: #e8f3fa;
  -webkit-box-shadow: 0px 1px 6px #74818f;
  box-shadow: 0px 1px 6px #74818f;
}

.nosh {
  margin:0;
  padding:0;
   -webkit-box-shadow: 0px 1px 6px white;
  box-shadow: 0px 1px 6px white;
  background: white;
}
.badgeicon {
  /* -webkit-filter: opacity(80%);
  filter: opacity(80%); */
  height: 420px;
  color: white;
  width: 40%;
  margin-bottom: 0;
  text-align: center;
  background-image: url("~@/assets/background2.jpg");
  background-size: cover;
  margin-top: 0;
 position: relative;
}

.binfo {
  margin:0;
  padding:0;
}

.background {
  position: absolute;
  margin:0;
  /* z-index: 5555; */
  background-size: cover;
  height: 100%;
  width: 100%;
}

.bcontent {
  width:100%;
  height: 100%;
}

.bpic {
  height: 100%;
  width:100%;
  /* z-index: 3333; */
  -webkit-filter: brightness(50%); /* Safari 6.0 - 9.0 */
  filter: brightness(50%);
  background-size: cover;
  position: absolute;
}



.zoomin {
  width: 100%;
  border:none;
}

.btn2 {
  width: 100%;
}

.description {
  font-size: 17px;
}
.byorg {
  position: relative;
  width: 70%;
  left: 15%;
}
.loading {
  margin-top: 30px;
  padding-top: 190px;
  padding-bottom: 190px;
  background: #e6f1f5;
}

.align-middle {
  color: rgb(3, 78, 133);
  height: 30px;
  width: 30px;
}

#loading2 {
  color: rgb(3, 78, 133);
  height: 70px;
  width: 70px;
}
.sheader {
  /* background: rgb(138, 196, 219, 0.9); */
  text-align: right;
  font-family: verdana;
  overflow: visible;
  padding-bottom: 0;
  padding-right: 7px;
}
#createC {
  border: none;
  border-radius: 2px;
  padding-left: 12px;
  padding-right: 12px;
  font-size: 15px;
  padding-top: 7px;
  padding-bottom: 7px;
  margin: 4px;
}
#line {
  color: lightblue;
  margin-top: 5px;
  height: 4px;
  background: lightblue;
}

.btn {
  color:white;
}

.fit {
  width:100%;
  text-align: center;
  border:none;
}
.tbadge {
  font-size: 18px;
  margin-left: 2%;
  margin-bottom: 0;
  padding-bottom: 0;
  margin-right: 2%;
  color: #225880;
  padding-top: 10px;
  margin-top: 20px;
}
label {
  margin-top: 5px;
}

.bdgs {
  border-radius: 0;
  margin-bottom: 10px;
  background: #f2f5f5;
}
.temp {
  margin-top: 50px;
  margin-bottom: 100px;
  color: #2a5c82;
}

#mybadge {
  text-align: center;
  margin-top: 0px;
  padding-top: 0;
  font-family: verdana;
  overflow: hidden;
}
.error {
  color: red;
  font-size: 13px;
}

.add {
  text-align: center;
  color: #0071ff;
  padding: 10px;
  background: lightblue;
  border-radius: 5px;
}

.binput {
  margin-bottom: 15px;
}

.pending {
  padding: 0;
  margin: 0;
}
</style>
