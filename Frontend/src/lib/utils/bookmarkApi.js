const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1492';
console.log('API_URL:', API_URL);

// 북마크 추가
export async function addBookmark(recipeId, accessToken) {
  const res = await fetch(`${API_URL}/api/v1/bookmarks/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ recipe_id: recipeId }),
  });
  if (!res.ok) throw new Error('북마크 추가 실패');
  return await res.json();
}

// 북마크 해제
export async function removeBookmark(recipeId, accessToken) {
  const res = await fetch(`${API_URL}/api/v1/bookmarks/${recipeId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) throw new Error('북마크 해제 실패');
}

// 내 북마크 목록 조회
export async function fetchBookmarks(accessToken) {
  const res = await fetch(`${API_URL}/api/v1/bookmarks/`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) throw new Error('북마크 목록 불러오기 실패');
  return await res.json();
} 