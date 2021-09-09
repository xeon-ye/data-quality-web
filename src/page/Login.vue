<!--
* 登录页面
-->

<template>
    <div class="login-wrap">
        <vue-particles
            color="#283570"
            :particleOpacity="0.9"
            :particlesNumber="80"
            shapeType="circle"
            :particleSize="4"
            linesColor="#283570"
            :linesWidth="1"
            :lineLinked="true"
            :lineOpacity="0.4"
            :linesDistance="150"
            :moveSpeed="3"
            :hoverEffect="true"
            hoverMode="grab"
            :clickEffect="true"
            clickMode="push"
        ></vue-particles>
        <div class="guagn-left"></div>
        <div class="guagn-right "></div>
        <header class="header">
            <img :src="config.logo" alt="" />
            <span class="title">{{config.title}}</span>
        </header>
        <div class="login-warp">
            <div class="left">
                <img src="../assets/img/loginbg.png" alt />
            </div>
            <div class="right">
                <div class="ms-login">
                    <div class="ms-title">{{config.title}}</div>
                    <el-form
                        :model="param"
                        :rules="rules"
                        ref="login"
                        label-width="0px"
                        class="ms-content"
                    >
                        <el-form-item prop="username">
                            <el-input
                                v-model="param.username"
                                placeholder="username"
                                class="kyle"
                                prefix-icon="el-icon-user"
                                @change="tips=''"
                            ></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input
                                class="kyle"
                                type="password"
                                placeholder="password"
                                v-model="param.password"
                                prefix-icon="el-icon-lock"
                                @keyup.enter.native="submitForm()"
                                @change="tips=''"
                            ></el-input>
                        </el-form-item>
                        <div class="login-btn kyle">
                            <el-button type="primary" @click="submitForm()">登录</el-button>
                        </div>
                        <p class="login-tips">{{tips}}</p>
                    </el-form>
                </div>
            </div>
        </div>
        <footer class="footer">
            <div>
                <img src="../assets/logo_footer.png"  />
            </div>
            <div>Copyright@2018-2020</div>
        </footer>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    data: function () {
        return {
            config: window.config,
            param: {
                username: 'hecha',
                password: '123456'
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            },
            tips:""
        };
    },
    computed: {
        ...mapGetters(["tagWel"])
    },
    methods: {
        submitForm() {
            this.$refs.login.validate((valid) => {
                if (valid) {
                    // this.$message.success('登录成功');
                    // localStorage.setItem('ms_username', this.param.username);
                    // this.$router.push('/');
                    this.$store
                        .dispatch("LoginByUsername", this.param)
                        .then(() => {
                            this.$router.push({ path: this.tagWel.value });
                            // this.$router.push('/');
                        })
                        .catch(error => {
                            // this.refreshCode();
                            if(error&&error.response&&error.response.status==426){
                                this.tips = "账号或密码错误"
                            }else{
                                this.tips = "登录失败，请联系管理员"
                            }
                        });
                } else {
                    // this.$message.error('请输入账号和密码');
                    // console.log('error submit!!');
                    return false;
                }
            });
        }
    }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #0a112b;
}
.ms-title {
    width: 100%;
    text-align: center;
    font-size: 24px;
    padding-top: 20px;
    color: #fff;
}
.ms-login {
    width: 400px;
    border-radius: 5px;
    background: rgba(9, 22, 057, 0.7);
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.2);
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    /* margin-bottom: 10px; */
}
.login-tips {
    font-size: 12px;
    color: #F56C6C;
    margin: 0;
    height: 16px;
}
.kyle >>> input.el-input__inner {
    background: #fff;
    color: #333;
    border: 1px solid rgba(0, 0, 0, 0.3);
}
.kyle >>> button.el-button--primary {
    background: #3278ab;
    color: #fff;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.3);
}
.login-warp {
    width: 1200px;
    padding-right: 100px;
    display: flex;
    justify-content: space-between;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    align-items: center;
}
.header {
    width: 100%;
    height: 58px;
    background: rgba(9, 22, 057, 0.7);
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    padding-left: 20px;
}
.header img {
    /* width: 120px; */
    max-height: 58px;
}
.title {
    font-size: 22px;
    color: #fff;
    font-weight: bold;
    padding-left: 10px;
}
.footer {
    box-sizing: border-box;
    width: 100%;
    height: 40px;
    color: #ccc;
    font-size: 12px;
    background: rgba(9, 22, 057, 0.3);
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}
.guagn-right {
    width: 353px;
    height: 407px;
    background: url('../assets/img/loginl.png') 0 0 no-repeat;
    position: fixed;
    right: 0;
    top: 0;
}
.guagn-left {
    width: 353px;
    height: 407px;
    background: url('../assets/img/loginr.png') 0 0 no-repeat;
    position: fixed;
    left: 0;
    top: 0;
}
</style>