<template>
  <div class="orgpage">
    <div id="Profile">
      <div class="prfl small">
        <div class="logo" v-bind:class="{smallLogo: resized2}">
          <img :src="url" alt class="profile" v-bind:class="{smallpro: resized2}" />
        </div>
      </div>
    </div>
    <div class="innercont" v-bind:class="{ftsize: resized}">
      <form @submit.prevent="save">
        <div class="accinfo">
          <div class="mrgnbtm">
            <span class="labl">Profile picture</span>
            <b-form-file class="binput" placeholder @change="onFileChange" ref="background"></b-form-file>
          </div>
          <div class="inputholder">
            <span>Email</span>
            <b-input type="email" class="binput" required v-model="info.email"></b-input>
          </div>
          <!-- <div class="inputholder" v-bind:class="{red: passhort}">
            <span>Password</span>
            <b-input
              type="password"
              class="binput"
              v-bind:class="{unameErr: passhort}"
              required
              v-model="password"
            ></b-input>
            <transition name="slide-fade">
              <span
                class="err"
                v-bind:class="{red: passhort}"
                v-show=" password.length < 8 && password  != ''"
              >must be at least 8 characters!</span>
            </transition>
          </div>-->
          <!-- <div class="inputholder" v-bind:class="{red: passErr}">
            <span>Confirm Password</span>
            <b-input
              type="password"
              v-bind:class="{unameErr: passErr}"
              class="binput"
              required
              v-model="confirmpassword"
          ></b-input>-->
          <!-- <transition name="slide-fade">
              <span
                class="err"
                v-bind:class="{red: passErr}"
                v-show="confirmpassword != password && confirmpassword && password"
              >Password doesn't match!</span>
          </transition>-->
          <!-- </div> -->
        </div>
        <div class="perinfo">
          <p class="sign2">Personal Information*</p>

          <div class="inputholder">
            <table>
              <tr>
                <td>
                  <span>Firstname</span>
                  <b-input type="text" class="binput" required v-model="info.firstname"></b-input>
                </td>
                <td>
                  <span>Lastname</span>
                  <b-input type="text" class="binput" required v-model="info.lastname"></b-input>
                </td>
              </tr>
            </table>
          </div>
          <div class="inputholder">
            <span>Address</span>
            <b-input type="text" class="binput" required v-model="info.address"></b-input>
          </div>
          <div class="inputholder bdd">
            <span>Date of birth</span>
            <table class="bday">
              <td>
                <b-input
                  class="binput"
                  autocomplete="off"
                  type="text"
                  placeholder="Month"
                  min="1"
                  id="mnth"
                  max="12"
                  required
                  v-model="info.birthdate.month"
                ></b-input>
                <div class="month">
                  <div v-for="(m,n) in cal" :key="n">
                    <h5 class="m" @click="month(m)">{{m}}</h5>
                  </div>
                </div>
              </td>
              <td>
                <b-input
                  type="number"
                  placeholder="Day"
                  min="1"
                  max="32"
                  class="binput"
                  required
                  v-model="info.birthdate.day"
                ></b-input>
              </td>
              <td>
                <b-input
                  type="number"
                  placeholder="Year"
                  min="1990"
                  max="2019"
                  class="binput"
                  required
                  v-model="info.birthdate.year"
                ></b-input>
              </td>
            </table>
          </div>
          <div class="inputholder">
            <table class="srow">
              <td>
                <span>Age</span>
                <b-input type="number" class="binput" required v-model="info.age" min="12"></b-input>
              </td>
              <td class="genders">
                <span class="g">Gender</span>
                <table>
                  <tr>
                    <td>
                      <b-form-radio v-model="info.gender" class="Gender" value="Male">
                        <span class="glabel">Male</span>
                      </b-form-radio>
                    </td>
                    <td>
                      <b-form-radio v-model="info.gender" class="Gender" value="Female">
                        <span class="glabel">Female</span>
                      </b-form-radio>
                    </td>
                  </tr>
                </table>
              </td>
            </table>
          </div>

          <p class="lbl">Are you working already?</p>
          <div class="inputholder">
            <span>Profession</span>
            <b-input type="text" class="binput" v-model="info.profession"></b-input>
          </div>
          <p class="lbl">Or still studying?</p>
          <span>or both?</span>
          <div class="inputholder">
            <span>School</span>
            <b-input type="text" class="binput" v-model="info.school"></b-input>
          </div>
          <div class="noChsn" v-show="hasError">
            <p class="ertxt" v-if="noChosen">Are you working or studying? Please fill up.</p>
            <p class="ertxt" v-if="passhort">Your password is weak! Must be 8 or more characters.</p>
            <p class="ertxt" v-if="passErr">Password did not match!</p>
          </div>
          <b-button @click="$router.push('/user')" class="lgnbtn" variant="danger">Cancel</b-button>&nbsp;
          <b-button type="submit" class="lgnbtn" variant="primary">
            <span v-if="!loading">Save changes</span>
            <span v-else>
              <span>Loading&nbsp;</span>
              <b-spinner class="align-middle"></b-spinner>&nbsp;
            </span>
          </b-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import $ from "jquery";

export default {
  name: "Userprofile",
  data() {
    return {
      info: {
        username: "",
        password: "",
        confirmpassword: "",
        firstname: "",
        lastname: "",
        email: "",
        age: 0,
        address: "",
        profession: "",
        school: "",
        gender: "",
        birthdate: { month: "", day: 0, year: 1999 },
        type: "",
        profilePic: ""
      },
      cal: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
      loading: false,
      focus: false,
      resized: false,
      resized2: false,
      err: false,
      passErr: false,
      passhort: false,
      noChosen: false,
      hasError: false,
      url: null,
      mnth: "",
      file: null,
      imageSrc:'http://localhost:8081/static/'
    };
  },
  
  methods: {
    onFileChange(e) {
      this.file = e.target.files[0];
      this.url = URL.createObjectURL(this.file);
      console.log(this.file);
    },
    save() {
      var fd = new FormData();
      fd.append("img", this.file);
      fd.append("user", this.$store.getters.token);
      for (var key in this.info.birthdate) {
        fd.append(key, this.info.birthdate[key]);
      }
      for (var key in this.info) {
        fd.append(key, this.info[key]);
      }

      if (this.url != null) {
        axios
          .post("http://localhost:8081/user/saveUpdate", fd, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(res => {
            this.url = this.imageSrc + res.data.profilePic
            this.file = null;
            this.info = res.data
            this.$router.push("/");
          })
          .catch(err => {
            alert(err);
          });
      } else {
        alert("Add Profile Picture!");
      }
    },
    validate() {
      this.loading = true;
      this.noChosen = this.school === "" && this.profession === "";
      return !this.noChosen;
    },
    month(m) {
      this.info.birthdate.month = m;
      this.focus = true;
      this.mnth = m;
    },
    handleResize() {
      if (window.innerWidth < 1000) {
        this.resized2 = true;
        if (window.innerWidth <= 650) {
          this.resized = true;
        } else {
          this.resized = false;
        }
      } else {
        this.resized = false;
        this.resized2 = false;
      }
    }
  },
  watch: {
    mnth(val) {
      if (val != "") {
        $(".month").slideUp();
      }
    }
  },
  mounted() {
    $("#mnth").focus(function() {
      $(".month").slideDown();
    });
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  created() {
    axios
      .post("http://localhost:8081/user/updateUser", {
        data: this.$store.getters.token
      })
      .then(res => {
        this.url = this.imageSrc + res.data.profilePic
        this.info = res.data;
      })
      .catch(err => {
        alert(err);
      });
  }
};
</script>


<style scoped>
.noChsn {
  padding: 10px;
  font-size: 13px;
  /* border: 1px solid red; */
  background: #f7e4e4;
  color: red;
  margin-bottom: 20px;
  border-radius: 5px;
}

.ertxt {
  padding: 0;
  margin: 0;
}
.ws {
  /* background:#fafcfc; */
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid lightgrey;
  border-radius: 5px;
}
.binput {
  background: #f5f9fa;
}
.lbl {
  font-size: 18px;
  margin-top: 35px;
  padding-bottom: 0;
  margin-bottom: 0;
}
.perinfo {
  /* background: white; */
  overflow: visible;
  padding: 0;
  padding-top: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  position: relative;
  text-align: center;
}
.accinfo {
  width: 100%;
  padding: 0;
  position: relative;
  margin-top: 0;
}
.innercont {
  color: #385b73;
  padding: 0;
  border-radius: 0;
  width: 600px;
  background: white;
  text-align: center;
  padding: 40px;
}

.ftsize {
  width: 100%;
  padding: 10px;
}
.bdd {
  padding-top: 10px;
}

.genders {
  padding-left: 40px;
  padding-top: 0;
  padding-bottom: 0;
  position: relative;
  /* background:grey; */
  height: 10px;
}

.g {
  top: 10px;
  left: 20px;
  position: absolute;
}
.Gender {
  margin: 0;
  height: 10px;
  padding: 0;
}
.fncol {
  margin: 0;
  width: 50%;
}
.month {
  padding: 0px;
  display: none;
  position: absolute;
  border: 1px solid black;
  z-index: 9999;
  background: #f7fafa;
}
.inputholder {
  margin-top: 0;
  margin-bottom: 20px;
  text-align: left;
}
.unameErr {
  border: 1px solid red;
  background: #f7e4e4;
  color: red;
}

.m {
  margin: 0;
  padding: 3px;
  font-weight: normal;
  font-size: 15px;
  background: #f5f9fa;
}

.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

.lgnbtn {
  font-family: verdana;
  font-size: 18px;
}

.lgt {
  color: red;
  text-decoration: underline;
}

hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid #b3b4b5;
  margin: 1em 0;
  padding: 0;
}

.uname {
  text-decoration: underline;
}
h5 {
  margin: 0;
  padding: 3px;
  font-weight: normal;
  font-size: 15px;
}

h5:hover {
  background-color: #0071ff;
  color: white;
}

.month {
  padding: 0px;
  display: none;
  position: absolute;
  border: 1px solid lightgray;
  z-index: 9999;
  background: #f7fafa;
}

#mnth {
  width: 100%;
  margin-left: 0;
}
#gend {
  font-size: 0.8em;
}

.bd {
  width: 100%;
}
.srow {
  margin-left: 0px;
  padding: 0;
  margin-top: 0;
  margin-bottom: 0;
  width: 100%;
}

.srow td {
  padding-top: 0;
  margin-top: 0;
  margin-bottom: 0;
  padding-bottom: 0;
  width: 50%;
}

#years {
  width: 150px;
  padding-left: 20px;
}

.gender {
  font-weight: normal;
}
.pholder {
  padding: 0;
}

.err {
  font-weight: normal;
  color: #1a95ed;
  font-size: 11px;
  position: absolute;
  left: 0px;
}
.red {
  color: red;
}

.fname {
  width: 100%;
  padding-right: 10px;
  margin: 0;
}
.ln {
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
}

#day {
  width: 10%;
}

.gg {
  margin-bottom: 0;
  /* height: 5px; */
  /* padding-top: 5px; */
  width: 100%;
  background: green;
}

.gg td {
  position: relative;
  padding: 0;
  margin: 0;
  /* width: 50%; */
}
.bday {
  width: 100%;
}

.bday td {
  padding: 0;
  width: 33%;
  padding: 1px;
}
.ln {
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.lname {
  padding-left: 10px;
  width: 100%;
  margin: 0;
}
table {
  width: 100%;
  margin-top: 0;
  padding-top: 0;
  margin: 0;
  padding: 0;
  overflow: visible;
}

.body {
  padding: 0;
  margin: 0;
}

.sign {
  padding: 0px;
  margin-top: 0;
  font-size: 25px;
  font-weight: unset;
  font-family: verdana;
  font-weight: normal;
  margin-bottom: 0px;
}

.rutext {
  font-size: 30px;
}
.sign2 {
  padding: 0px;
  margin-top: 0;
  font-size: 25px;
  font-weight: unset;
  padding-top: 0;
  font-family: verdana;
  font-weight: normal;
  margin-bottom: 10px;
}
/* ================================== */

.username {
  font-size: 17px;
  margin-top: 0px;
  color: #315273;
  width: 100%;
}
div {
  font-family: verdana;
}

.orgn {
  color: #364452;
  margin-bottom: 0;
}

.address {
  font-size: 15px;
  color: #3b4d70;

  font-weight: bold;
}

.des2 {
  color: #1e4773;
}
.email {
  color: #486399;
  font-size: 15px;
}
.emailadd {
  text-decoration: underline;
}
.prof {
  float: left;
}
p {
  margin-bottom: 5px;
  margin-top: 5px;
}

.profile {
  /* height: 200px; */

  width: auto;
  height: 250px;
}

#Profile {
  height: 150px;
  /* background-image: url("~@/assets/orgbackground.jpg"); */
  background: #186fa1;
  /* background-size: cover; */
  font-family: verdana;
}

.logo {
  overflow: hidden;
  margin-top: 30px;
  width: 250px;
  margin-bottom: 10px;
  -webkit-box-shadow: 0px 1px 5px #0e222b;
  box-shadow: 0px 1px 5px #0e222b;
  height: 250px;
  border: 1px solid white;
  background: white;
}
.prfl {
  float: left;
  width: 25%;
  /* margin-left:25px; */
  /* margin-right: 25px; */
  margin-bottom: 0px;
  /* border-bottom: 2px solid #d5e7f5; */
  /* background:grey; */
}

.small {
  width: 100%;
  margin: 0;
}

.update {
  border-radius: 2px;
}
.smallLogo {
  width: 180px;
  height: 180px;
  overflow: hidden;
}
.smallpro {
  width: auto;
  height: 180px;
}

.orgpage {
  width: 100%;
  padding-left: 0;
  padding-right: 0;
  padding-top: 50px;
}
</style>