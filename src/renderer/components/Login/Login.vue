<template>
  <div class="limiter">
    <div class="container-login100">
      <div class="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-50">
        <form class="login100-form validate-form">
          <img class="login100-form-title p-b-33" src="@/assets/images/cmb-logo.png"  style="display: table; margin: 0 auto;" />

          <div class="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz">
            <input class="input100" type="text" name="phone" :placeholder="$t('view.phone')" v-model="phoneNumber"/>
            <span class="focus-input100-1"></span>
            <span class="focus-input100-2"></span>
          </div>

          <div class="wrap-input100 rs1 validate-input" data-validate="Password is required">
            <input class="input100" type="password" name="pass" :placeholder="$t('view.password')" v-model="password"/>
            <span class="focus-input100-1"></span>
            <span class="focus-input100-2"></span>
          </div>

          <div class="wrap-input100 rs1 validate-input" data-validate="Password is required">
            <input class="input100" type="text" name="otp" :placeholder="$t('view.otp')" v-model="otp"/>
            <span class="focus-input100-1"></span>
            <span class="focus-input100-2"></span>
          </div>

          <div class="container-login100-form-btn m-t-20" @click.prevent="handleSubmit">
            <button class="login100-form-btn" style="background-color: #c70102">
              {{ $t('view.login') }}
            </button>
          </div>

          <div class="text-center p-t-45 p-b-4">
            <span class="txt1">
              {{ $t('view.forgetPasswordText') }}&nbsp;
            </span>

            <a href="#" class="txt2 hov1" style="color: #c70102">
              {{ $t('view.phone') }} / {{ $t('view.password') }}?
            </a>
          </div>

          <div class="text-center">
            <span class="txt1">
              {{ $t('view.notRegister') }}&nbsp;
            </span>

            <a href="#" class="txt2 hov1" style="color: #c70102">
              {{ $t('view.register') }}
            </a>
          </div>

          <div class="text-center" style="margin-top: 20px;">
            <a href="javascript:void(0)" style="color: #c70102"  @click="tabCn">
              切换到中文&nbsp;
            </a>

            <a href="javascript:void(0)" style="color: #c70102" @click="tabEn">
              Use English
            </a>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script src="@/assets/vendor/jquery/jquery-3.2.1.min.js"></script>
<script src="@/assets/vendor/animsition/js/animsition.min.js"></script>
<script src="@/assets/vendor/bootstrap/js/popper.js"></script>
<script src="@/assets/vendor/bootstrap/js/bootstrap.min.js"></script>
<script src="@/assets/vendor/select2/select2.min.js"></script>
<script src="@/assets/vendor/daterangepicker/moment.min.js"></script>
<script src="@/assets/vendor/daterangepicker/daterangepicker.js"></script>
<script src="@/assets/vendor/countdowntime/countdowntime.js"></script>
<script src="@/assets/js/main.js"></script>
<script>
import { getFromMain, getFromMainSync } from '@/assets/js/electron.js'
// import { https } from 'https'
import request from 'request-promise'

const https = require('https')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
https.globalAgent.options.rejectUnauthorized = false

export default {
  data () {
    return {
      phoneNumber: '',
      password: '',
      otp: ''
    }
  },
  methods: {
    tabEn () {
      console.log('To English')
      this.$i18n.locale = 'en_US'
    },
    tabCn () {
      console.log('To Chinese')
      if (window.isElectron === true) {
        console.log('isElectron')
      }
      this.$i18n.locale = 'zh_CN'
    },
    handleSubmit () {
      const { ipcRenderer } = require('electron')
      console.log('submmit button is pressed: ' + this.phoneNumber + ' ' + this.password + ' ' + this.otp)

      let options = {
        method: 'GET',
        uri: 'https://192.168.247.138/validate/check?user=' + this.phoneNumber + '&realm=realm_ny&pass=' + this.otp,
        query: {
          user: this.phoneNumber,
          realm: 'realm_ny',
          pass: this.otp
        },
        insure: true
      }

      request(options)
        .then((response) => {
          var res = JSON.parse(response)
          // console.log(res.result.value)
          if (res.result.value === true) {
            ipcRenderer.send('notification', '验证成功')
          } else {
            ipcRenderer.send('notification', '令牌码错误或超时，请重新输入')
          }
        })
        .catch((e) => {
          console.log(e)
        })

      // var req = https.request({
      //   host: '192.168.247.137',
      //   port: 443,
      //   path: '/validate/check',
      //   query: {
      //     user: this.phoneNumber,
      //     realm: 'realm_ny',
      //     pass: this.otp
      //   },
      //   method: 'GET',
      //   rejectUnauthorized: false,
      //   requestCert: true,
      //   agent: false
      // }, (response) => {
      //   console.log(response)
      //   if (response === true) {
      //     ipcRenderer.send('notification', '验证成功')
      //   } else {
      //     ipcRenderer.send('notification', '令牌码错误或超时，请重新输入')
      //   }
      // })

      // req.end()

      // req.on('error', function (err) {
      //   console.log(err)
      // })

      /* const agent = new https.Agent({
        rejectUnauthorized: false
      })
      this.$http
        .get('https://192.168.247.137/validate/check?user=' + this.phoneNumber + '&realm=realm_ny&pass=' + this.otp, {
          httpsAgent: agent
        })
        .then(
          response => {
            console.log(response)

            if (response.data.result.value === true) {
              ipcRenderer.send('notification', '验证成功')
            } else {
              ipcRenderer.send('notification', '令牌码错误或超时，请重新输入')
            }
          }
        ) */

      /* this.$http
        .get('https://192.168.247.137/validate/check?user=' + this.phoneNumber + '&realm=realm_ny&pass=' + this.otp)
        .then(
          response => {
            console.log(response)

            if (response.data.result.value === true) {
              ipcRenderer.send('notification', '验证成功')
            } else {
              ipcRenderer.send('notification', '令牌码错误或超时，请重新输入')
            }
          }
        ) */

      // ipcRenderer.send('reloadUrl', this.phoneNumber, this.password)
      // if (window.isElectron) {
      //   window.ipcRenderer.send('reloadUrl', this.phoneNumber, this.password)
      // }
    }
  },
  components: {},
  mounted () {
    var itemList = [1, 2, 3]
    getFromMain(itemList, function (event, response) {
      console.log('getFromMain called.')
      console.log(response)
    })
    console.log(getFromMainSync(itemList))
  }
}
</script>

<style scoped src="@/assets/vendor/bootstrap/css/bootstrap.min.css">
</style>
<style scoped src="@/assets/fonts/font-awesome-4.7.0/css/font-awesome.min.css">
</style>
<style scoped src="@/assets/fonts/Linearicons-Free-v1.0.0/icon-font.min.css">
</style>
<style scoped src="@/assets/vendor/animate/animate.css">
</style>
<style scoped src="@/assets/vendor/css-hamburgers/hamburgers.min.css">
</style>
<style scoped src="@/assets/vendor/animsition/css/animsition.min.css">
</style>
<style scoped src="@/assets/vendor/select2/select2.min.css">
</style>
<style scoped src="@/assets/vendor/daterangepicker/daterangepicker.css">
</style>
<style scoped src="@/assets/css/util.css">
</style>
<style scoped src="@/assets/css/main.css">
</style>
