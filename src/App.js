import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredId, setHoveredId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0].replace(/-/g, '.').slice(2),
    category: '공부',
    content: '',
    excerpt: ''
  });

  // 초기 글들
  const initialPosts = [
    {
      id: 1,
      title: '배움',
      date: '26.7.12',
      category: '공부',
      content: '며칠 전부터 클로드를 배우고 있다. 내 스스로 너무 빠른 속도로 변화하는 현재의 사회적 분위기가 싫었다. 그래서 멀리했고 지금의 나의 것을 지키고 싶어 피하기도 했다. 하지만 이제는 배워야 되는 시점이 왔다. 여기에서 내가 할 수 있는 것들을 또 찾아봐야지.',
      excerpt: '며칠 전부터 클로드를 배우고 있다. 새로운 시대에 적응하려는 마음가짐으로...'
    },
    {
      id: 2,
      title: '반쪽 생일',
      date: '26.7.12',
      category: '일상',
      content: '오늘 아내 생일이다. 하필 수은이 여행일정과 겹쳐서 쉬지도 못하고 챙겨주지도 못하고 마음이 속상하다. 요새 아내가 많이 힘들어한다. 심적으로 육체적으로 옆에서 도와줘야 하는데 나도 내 감정이 마음이 아파서 잘 안된다. 언제쯤 더 나아질 수 있을까?',
      excerpt: '오늘 아내 생일이다. 하필 여행일정과 겹쳐서...'
    }
  ];

  // 로컬스토리지에서 글 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('happyHousePosts');
    if (saved) {
      setPosts(JSON.parse(saved));
    } else {
      setPosts(initialPosts);
      localStorage.setItem('happyHousePosts', JSON.stringify(initialPosts));
    }
  }, []);

  // 글 저장하기
  const savePosts = (newPosts) => {
    setPosts(newPosts);
    localStorage.setItem('happyHousePosts', JSON.stringify(newPosts));
  };

  // 폼 입력 변경
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 글 추가하기
  const handleAddPost = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    const newPost = {
      id: posts.length + 1,
      title: formData.title,
      date: formData.date,
      category: formData.category,
      content: formData.content,
      excerpt: formData.excerpt || formData.content.slice(0, 50) + '...'
    };

    const updatedPosts = [newPost, ...posts];
    savePosts(updatedPosts);

    // 폼 초기화
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0].replace(/-/g, '.').slice(2),
      category: '공부',
      content: '',
      excerpt: ''
    });
    setShowForm(false);
    alert('글이 추가되었습니다!');
  };

  const categories = ['all', '공부', '일상', '여행', '요리'];

  const getCategoryStyle = (category) => {
    const styles = {
      '공부': { bg: '#E8F4FF', text: '#0066CC', border: '#B3D9FF' },
      '일상': { bg: '#F0F8E8', text: '#2D5016', border: '#D4F0C1' },
      '여행': { bg: '#FFF4E6', text: '#D97706', border: '#FFE4B5' },
      '요리': { bg: '#FFE8E8', text: '#D32F2F', border: '#FFB3B3' }
    };
    return styles[category] || styles['공부'];
  };

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(post => post.category === selectedCategory);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', paddingBottom: '50px' }}>
      <header style={{ textAlign: 'center', paddingTop: '60px', paddingBottom: '50px', color: '#2c3e50' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '700', margin: '0 0 15px', letterSpacing: '-1px' }}>Happy House</h1>
        <p style={{ fontSize: '18px', color: '#555', margin: '0', fontWeight: '300' }}>일상의 작은 행복들을 기록합니다</p>
      </header>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px', marginBottom: '30px', textAlign: 'center' }}>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            backgroundColor: '#0066CC',
            color: '#ffffff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '25px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 102, 204, 0.2)',
            transition: 'all 0.3s ease'
          }}
        >
          {showForm ? '글쓰기 닫기' : '새 글 작성'}
        </button>
      </div>

      {showForm && (
        <div style={{ maxWidth: '900px', margin: '0 auto 30px', padding: '30px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
          <form onSubmit={handleAddPost}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>제목</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="글의 제목을 입력하세요"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>날짜</label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  placeholder="26.7.12"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>카테고리</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="공부">공부</option>
                  <option value="일상">일상</option>
                  <option value="여행">여행</option>
                  <option value="요리">요리</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>요약 (선택)</label>
              <input
                type="text"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="한 줄 요약 (비우면 자동 생성)"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>내용</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="글의 내용을 입력하세요"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  minHeight: '150px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: '#0066CC',
                color: '#ffffff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              글 추가하기
            </button>
          </form>
        </div>
      )}

      <nav style={{ maxWidth: '900px', margin: '0 auto 40px', padding: '0 20px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              backgroundColor: selectedCategory === cat ? '#0066CC' : '#ffffff',
              color: selectedCategory === cat ? '#ffffff' : '#555',
              border: '2px solid ' + (selectedCategory === cat ? '#0066CC' : '#ddd'),
              padding: '10px 20px',
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: selectedCategory === cat ? '0 4px 12px rgba(0, 102, 204, 0.2)' : 'none'
            }}
          >
            {cat === 'all' ? '전체' : cat}
          </button>
        ))}
      </nav>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => {
            const catStyle = getCategoryStyle(post.category);
            return (
              <article
                key={post.id}
                onMouseEnter={() => setHoveredId(post.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '32px',
                  marginBottom: '24px',
                  boxShadow: hoveredId === post.id
                    ? '0 12px 24px rgba(0, 0, 0, 0.12)'
                    : '0 2px 8px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  transform: hoveredId === post.id ? 'translateY(-4px)' : 'translateY(0)',
                  borderLeft: '4px solid ' + catStyle.text
                }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{
                    backgroundColor: catStyle.bg,
                    color: catStyle.text,
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    border: '1px solid ' + catStyle.border
                  }}>
                    {post.category}
                  </span>
                  <span style={{ color: '#999', fontSize: '13px', fontWeight: '500' }}>{post.date}</span>
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 12px', color: '#2c3e50', lineHeight: '1.3' }}>
                  {post.title}
                </h2>
                <p style={{ fontSize: '15px', color: '#666', margin: '0 0 16px', lineHeight: '1.8', fontWeight: '400' }}>
                  {post.excerpt}
                </p>
                <div style={{ paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
                  <p style={{ fontSize: '15px', color: '#555', margin: '0', lineHeight: '1.8', whiteSpace: 'pre-wrap', fontWeight: '400' }}>
                    {post.content}
                  </p>
                </div>
              </article>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <p style={{ color: '#999', fontSize: '16px' }}>이 카테고리에는 글이 없습니다.</p>
          </div>
        )}
      </main>

      <footer style={{ textAlign: 'center', marginTop: '80px', paddingTop: '30px', color: '#999', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <p style={{ margin: '0', fontSize: '14px' }}>© 2026 Happy House. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;