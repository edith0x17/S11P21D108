<template>
  <div id=survey class="min-h-screen bg-gray-100 flex items-center justify-center p-4 card mb-3 shadow-sm">
    <div class="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
      <div class="p-6">
        <h4>상권 분석 결과</h4>
        <hr>

        <!-- 평가 결과가 있을 때만 결과를 보여줌 -->
        <div v-if="evaluationResult" class="space-y-4 text-lg">
          <p><strong>주 연령층은</strong> <span class="result-value">{{ evaluationResult.age_group }}</span><strong>입니다.</strong></p>
          <p><strong>유동인구는</strong> <span class="result-value">{{ evaluationResult.foot_traffic }}</span><strong>입니다.</strong></p>
          <p><strong>물가는</strong> <span class="result-value">{{ evaluationResult.nearby_prices }}</span><strong>입니다.</strong></p>
          <p><strong>분위기는</strong> <span class="result-value">{{ evaluationResult.atmosphere }}</span><strong>입니다.</strong></p>
        </div>

        <!-- 결과가 없을 때 표시 -->
        <div v-else class="text-center text-gray-500">
          <p>평가 결과가 없습니다.</p>
        </div>
      </div>
    </div>
  </div>
  <!--평가 폼-->
  <SurveyForm
          v-if="isAuthenticated"
            :place="place"
            @evaluationUpdated="fetchEvaluationResult"
        />
</template>

<script setup>
import { ref, onMounted, watch, defineProps } from 'vue'
import { useRoute } from 'vue-router'
import { getStatisticsAreaEvaluation } from '@/api/analytic' // 필요한 경로에 맞춰 import
import SurveyForm from "./SurveyForm.vue";
import { useAccountStore } from "@/stores/useAccountStore";


const store = useAccountStore();
// props로 전달된 place(areaId 역할)
const props = defineProps({
  place: String
})

const isAuthenticated = ref(store.isAuthenticated); // store의 인증 상태 확인
// 평가 결과 저장 변수
const evaluationResult = ref(null)

// 현재 페이지의 라우트 정보를 가져오기 위해 useRoute 훅 사용
const route = useRoute()

// 특정 상권의 평가 결과 조회
const fetchEvaluationResult = async () => {
    getStatisticsAreaEvaluation(props.place, null, (response) => {
      console.log('평가 결과 조회 성공:',response.data.area_id)
      if (response.data.area_id ) {
        evaluationResult.value = response.data
      }
      else{
        console.log()
        evaluationResult.value = null;
        console.log("데이터가 없습니다.")
      }
    }, (error) => {
        console.error('평가 결과 조회 실패:', error)
    })
}

// place 값이 변경될 때마다 평가 결과를 다시 조회
watch(() => props.place, (newPlace) => {
  if (newPlace) {
    fetchEvaluationResult()
  }
})

// 페이지가 로드될 때 자동으로 평가 결과를 조회
onMounted(() => {
  fetchEvaluationResult()
})

defineExpose({
  fetchEvaluationResult // 이 함수를 외부에서 호출할 수 있도록 노출
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');

* {
    font-family: 'Noto Sans KR', sans-serif;
}
.result-value {
  font-weight: 600;
  color: #005eff;
  background-color: #f7fafc;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  display: inline-block;
}

.text-center {
  text-align: center;
}
</style>
