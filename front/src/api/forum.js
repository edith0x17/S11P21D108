import { localAxios } from "@/util/http-commons";

const local = localAxios();

// 게시글 생성 API
function createPost(payload, success, fail) {
  local.post(`/api/posts`, payload)
    .then(success)
    .catch(fail);
}

// 게시글 목록 조회 API
function listPost(areaId, success, fail) {
  console.log("API 요청을 보낼 areaId:", areaId); // areaId 확인
  local.get(`/api/posts/area/${areaId}`)
  .then(success)
  .catch(fail);
}

// 게시글 상세 조회 API
function getPostDetail(postId, success, fail) {
  local.get(`/api/posts/${postId}`)
    .then((response) => {
      console.log('API 응답:', response);
      success(response);
    })
    .catch((error) => {
      console.log('API 호출 에러:', error);
      fail(error);
    });
}

// 게시글 삭제 API
function deletePostAPI(postId, success, fail) {
  local.delete(`/api/posts/${postId}`)
    .then(success)
    .catch(fail);
}

// 댓글 목록 조회 API
function getRepliesAPI(postId, success, fail) {
  local.get(`/api/posts/${postId}/replies`)
    .then(success)
    .catch(fail);
}

// 댓글 등록 API
function submitReplyAPI(postId, payload, success, fail) {
  local.post(`/api/posts/${postId}/replies`, payload)
    .then(success)
    .catch(fail);
}

// 댓글 삭제 API
function deleteReplyAPI(postId, replyId, success, fail) {
  console.log('삭제할 댓글 API 호출 - Post ID:', postId, 'Reply ID:', replyId); // 확인용 로그
  local.delete(`/api/posts/${postId}/replies/${replyId}`)
    .then(success)
    .catch(fail);
}
// 댓글 수정 API
function updateReplyAPI(postId, replyId, payload, success, fail) {
  local.put(`/api/posts/${postId}/replies/${replyId}`, payload)
    .then(success)
    .catch(fail);
}

function updatePost(postId, payload, success, fail) {
  local.put(`/api/posts/${postId}`, payload)
    .then(success)
    .catch(fail);
}


export {
  createPost,
  listPost,
  getPostDetail,
  getRepliesAPI,
  submitReplyAPI,
  deleteReplyAPI,
  updateReplyAPI,
  deletePostAPI,
  updatePost
};