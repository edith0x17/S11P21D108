<template>
  <div class="main-container">
    <div class="signup-wrapper">
      <div class="signup-container">
        <h2>Sign Up</h2>
        <p>회원가입 후 다양한 기능을 이용하세요.</p>
        <form @submit.prevent="handleSignUp">
           <!-- 아이디 필드 -->
           <label for="username">아이디</label>
          <div class="d-flex justify-content-between mb-1">
            <input type="text"
                   id="username" placeholder="아이디" v-model="username" :disabled="isUsernameChecked"
            />
            <button
              type="button"
              class="mb-3"
              @click="handleUsername(username)"
              :disabled="isUsernameChecked"
              :class="{ 'btn btn-secondary': isUsernameChecked, 'btn btn-primary': !isUsernameChecked }"

            >
              아이디 중복 확인
            </button>
          </div>
          <span v-if="isUsernameError" class="error-text">{{usernameMessage}}</span>

          <!-- 닉네임 필드 -->
          <label for="nickname">닉네임</label>
          <div class="d-flex justify-content-between mb-1">
            <input
                type="text"
                id="nickname"
                placeholder="닉네임"
                v-model="nickname"
                :disabled="isNicknameChecked"
            />
            <button
                class="mb-3"
                type="button"
                @click="handleNickname(nickname)"
                :disabled="isNicknameChecked"
                :class="{ 'btn btn-secondary': isNicknameChecked, 'btn btn-primary': !isNicknameChecked }"
            >
              닉네임 중복 확인
            </button>
          </div>
            <span v-if="isNicknameError" class="error-text">{{nicknameMessage}}</span>
          <!-- 이메일, 인증 -->
          <label for="email">이메일</label>
          <div class="d-flex justify-content-between mb-1">
            <input
                type="email"
                id="email"
                placeholder="example@example.com"
                v-model="email"
                :disabled="isEmailChecked"
            />
            <button
                class="mb-3"
                type="button"
                @click="handleGetAuthCode"
                :disabled="isEmailChecked || isEmailSend"
                :class="{ 'btn btn-secondary': isEmailChecked, 'btn btn-primary': !isEmailChecked }"
            >{{ isEmailChecked ? "인증 완료" : "인증번호 전송" }}</button>
          </div>
          <span v-if="isEmailError" class="error-text">{{emailMessage}}</span>
          <!-- 인증번호 확인 -->
          <!-- 인증번호 입력 -->
          <div v-if="isEmailSend">
            <label for="authCode">인증번호</label>
            <div class="d-flex justify-content-between mb-1">
              <input
                  type="text"
                  id="authCode"
                  placeholder="인증번호"
                  v-model="authCode"
                  :disabled="isEmailChecked"
              />
              <span v-if="!isEmailChecked" class="timer mb-3">{{ formatTime(validationTime) }}</span>
              <button
                  class="mb-3 ms-2"
                  type="button"
                  @click="handleCheckAuthCode"
                  :disabled="isEmailChecked"
                  :class="{ 'btn btn-secondary': isEmailChecked, 'btn btn-primary': !isEmailChecked }"
              >인증번호 확인</button>
            </div>
          </div>
          <!-- 비밀번호 -->
          <label for="password">비밀번호</label>
          <input type="password" id="password" placeholder="비밀번호" v-model="password" />
          <span v-if="!isPasswordValidated(password)" class="error-text">비밀번호는 특수문자와 숫자를 포함한 8자 이상 이어야 합니다.</span>

          <!-- 비밀번호 확인 -->
          <label for="passwordConfirm">비밀번호 확인</label>
          <input type="password" id="passwordConfirm" placeholder="비밀번호 확인" v-model="passwordConfirm" />
          <span v-if="isPasswordValidated(password) && passwordConfirm && !isPasswordConfirmed()" class="error-text">비밀번호 확인이 일치하지 않습니다.</span>
          <!-- 확인버튼 -->
          <button type="submit" class="mt-2">Sign Up</button>
        </form>

        <p>이미 계정이 있으신가요? <router-link to="/members/login">Log In</router-link></p>
      </div>
    </div>
  </div>
</template>
  
<script setup>
  import { ref, watch } from "vue";
  import { useRouter } from "vue-router";
  import { formatTime } from "@/util/Util.js";
  import {
    isUsernameValidated,
    isEmailValidated,
    isNicknameValidated,
    isPasswordValidated,
    isNicknameDuplicated,
    isUsernameDuplicated,
    checkAuthCode,
    getAuthCode,
    signUp, login,
    updateEmail, isEmailDuplicated
  } from "@/util/AuthenticationUtil.js";
  import {useAccountStore} from "@/stores/useAccountStore.js";


  const router = useRouter();
  const usernameMessage = ref("");
  const nicknameMessage = ref("");
  const username = ref("");
  const password = ref("");
  const email = ref("");
  const passwordConfirm = ref("");
  const nickname = ref("");
  const authCode = ref("");
  const validationTime = ref(300);
  const isEmailSend = ref(false);
  const isEmailChecked = ref(false);
  const isNicknameError = ref(false);
  const isNicknameChecked = ref(false);
  const isUsernameError = ref(false);
  const isUsernameChecked = ref(false);
  const isEmailError = ref(false);
  const emailMessage = ref("");
  const accountStore = useAccountStore();

  function isPasswordConfirmed() {
    return password.value === passwordConfirm.value
  }

  function handleSignUp() {
    let err = ""
    switch (true) {
      case !isUsernameValidated(username.value):
        err = "아이디는 영어와 숫자를 포함하여 20자 이내로 설정해야 합니다."
        break;
      case !isNicknameChecked.value:
        err = "닉네임 중복 확인을 해주세요."
        break;
      case !isEmailChecked.value:
        err = "이메일 인증을 해주세요."
        break;
      case !isPasswordValidated(password.value):
        err = "비밀번호는 특수문자와 숫자를 포함한 8자 이상 이어야 합니다."
        break;
      case !password.value:
        err = "비밀번호를 입력해주세요."
        break;
      case !isPasswordConfirmed():
        err = "비밀번호 확인과 일치하지 않습니다."
        break;
      default:
        break;
    }

    if (err) {
      alert(err)
      return;
    }

    signUp(username.value, nickname.value, email.value, password.value)
        .then(response => {
          // 여기 위치에서 로그인
          if (response) {
            login(username.value, password.value)
                .then((response) => {
                  accountStore.isAuthenticated = true;
                  accountStore.userInfo = response.data
                  router.push("/")
                      .then(() => {
                        window.location.reload();
                      }
                )})
          }
        })
        .catch((error) => {
          alert("회원가입에 실패했습니다.")
          console.error(error)
        })
    }

// 아이디 유효성 및 중복 확인
function handleUsername(username) {
  if (!isUsernameValidated(username)) {
    usernameMessage.value = "유효하지 않은 아이디입니다.";
    isUsernameError.value = true;
    return;
  }

  isUsernameDuplicated(username)
      .then(() => {
        if (window.confirm("사용할 수 있는 아이디입니다.\n사용하시겠습니까?")) {
          isUsernameChecked.value = true;
          isUsernameError.value = false;
          usernameMessage.value = "";
        }
    })
  .catch(error => {
    console.error(error);
    usernameMessage.value = error.response.data;
    isUsernameError.value = true;
  });
}

  // 닉네임 유효성 및 중복 확인
  function handleNickname(nickname) {
    console.log(nickname)
    if (!isNicknameValidated(nickname)) {
      nicknameMessage.value = "유효하지 않은 닉네임 입니다.";
      isNicknameError.value = true;
      return;
    }

    isNicknameDuplicated(nickname)
        .then((response) => {
          console.log(response)
          if (window.confirm("사용할 수 있는 닉네임입니다.\n사용하시겠습니까?")) {
            isNicknameChecked.value = true;
            isNicknameError.value = false;
            nicknameMessage.value = "";
          }})
        .catch(error => {
      console.error(error);
      nicknameMessage.value = error.response.data;
      isNicknameError.value = true;
    });
  }

  // 이메일 인증번호 발송
  function handleGetAuthCode() {
    if (!isEmailValidated(email.value)) {
      isEmailError.value = true;
      emailMessage.value = "유효하지 않은 이메일 입니다."
      return;
    }
    isEmailDuplicated(email.value)
        .then(() => {
          if (window.confirm("사용하실 수 있는 이메일 입니다. \n사용하시겠습니까?")) {
            alert("이메일이 발송되었습니다.")
            isEmailSend.value = true;
            validationTime.value = 300;
            getAuthCode(email.value)
          }
        })
        .catch((error) => {
          console.error(error)
          emailMessage.value = error.response.data;
          isEmailError.value = true;
        })
  }

  // 이메일 인증번호 확인
  function handleCheckAuthCode() {
    checkAuthCode(email.value, authCode.value)
        .then(isVerified => {
          if (isVerified) {
            alert("인증되었습니다.")
            isEmailChecked.value = true;
          }
        })
        .catch(() => {
          alert("인증 번호를 다시 한 번 확인해주세요.")
        })
  }
  watch([nickname], () => {
    isNicknameError.value = false;
  })

  watch([username], () => {
      isUsernameError.value = false;
  })

  watch([email], () => {
    isEmailError.value = false;
  })
  // 이메일 시간 제한 타이머
  let timer = null;
  watch([isEmailSend, validationTime], ([newIsEmailSend, newValidationTime]) => {
    if (isEmailChecked.value) {
      newValidationTime = 0;
      timer = null;
    }
    if (timer) {
      clearInterval(timer);
    }
    if (newIsEmailSend && newValidationTime > 0) {
      timer = setInterval(() => {
        validationTime.value -= 1;
      }, 1000)}
    else if (newValidationTime === 0) {
      isEmailSend.value = false;
      clearInterval(timer);
      timer = null;
    }
  })
</script>

<style scoped>
/* 전체 레이아웃을 잡는 컨테이너 */
.main-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background-color: #f3f4f6;
}

.signup-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: 1rem;
  box-sizing: border-box;
}

.signup-container {
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  background-color: white;
  border-radius: 8px; /* Add border radius for better UI */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Add subtle shadow for focus */
}

.signup-container h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
}

.signup-container p {
  text-align: center;
  margin-bottom: 2rem;
  color: #666;
}

.signup-container form {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.signup-container label {
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #444;
}

.signup-container input {
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
  font-size: 1rem;
}

.signup-container button {
  padding: 0.8rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.signup-container button:hover {
  background-color: #218838;
}

/* Align 아이디/닉네임 input and button in the same row */
.signup-container .d-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.signup-container .d-flex input {
  flex-grow: 1;
  margin-right: 10px;
  min-width: 0; /* To allow shrinking */
}

.signup-container .d-flex button {
  white-space: nowrap;
  flex-shrink: 0;
}

.signup-container .email-verification,
.verification-code {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.signup-container .email-verification input,
.verification-code input {
  flex: 1;
  margin-right: 0.5rem;
  height: 40px;
}

.signup-container .email-verification button,
.verification-code button {
  padding: 0 10px;
  height: 40px;
  white-space: nowrap;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.signup-container .verification-code .timer {
  font-size: 0.9rem;
  color: #888;
  margin-right: 10px;
}

.error-text {
  color: red;
  font-size: 0.9rem;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
}

/* Disabled button styling */
.signup-container .btn-secondary {
  background-color: #6c757d;
}

.signup-container .btn-primary {
  background-color: #28a745;
}

.signup-container .btn-primary:disabled {
  background-color: #c4c4c4;
}

.signup-container p a {
  color: #007bff;
}

.signup-container p a:hover {
  text-decoration: underline;
}
</style>