'use client';

import AuthGuard from '@/components/auth/AuthGuard';

export default function PostsPage() {
  return (
    <AuthGuard requireAuth={true}>
      <div>
        <h1>Posts</h1>
        <p style={{ 
          color: '#666', 
          fontStyle: 'italic',
          backgroundColor: '#f8f9fa',
          padding: '1rem',
          borderRadius: '4px',
          marginTop: '1rem'
        }}>
          This page will display the list of posts once the posts feature is implemented. 
          Features will include:
        </p>
        
        <ul style={{ marginTop: '1rem', marginLeft: '1rem' }}>
          <li>Post listing with pagination</li>
          <li>Search functionality</li>
          <li>Filter and sort options</li>
          <li>Post creation and editing</li>
          <li>Comments system</li>
        </ul>
        
        <div style={{ marginTop: '2rem' }}>
          <button
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onClick={() => alert('Create new post functionality would be implemented here')}
          >
            + Create New Post
          </button>
        </div>
      </div>
    </AuthGuard>
  );
}