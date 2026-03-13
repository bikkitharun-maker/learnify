import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const CATEGORIES = [
  { id: 'all',             label: 'All Courses' },
  { id: 'web-development', label: 'Web Development' },
  { id: 'languages',       label: 'Programming Languages' },
  { id: 'ai',              label: 'AI & Machine Learning' },
];
const LEVELS   = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const SORT_OPT = [
  { val: 'popular',   label: 'Most Popular' },
  { val: 'rating',    label: 'Highest Rated' },
  { val: 'newest',    label: 'Newest' },
  { val: 'price_asc', label: 'Price: Low to High' },
  { val: 'price_desc',label: 'Price: High to Low' },
];

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [all, setAll]     = useState([]);
  const [shown, setShown] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query,    setQuery]    = useState(searchParams.get('search') || '');
  const [cat,      setCat]      = useState(searchParams.get('category') || 'all');
  const [level,    setLevel]    = useState('All Levels');
  const [sort,     setSort]     = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    axios.get('/api/courses')
      .then(r => setAll(r.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q   = (searchParams.get('search') || '').toLowerCase();
    const c   = searchParams.get('category') || 'all';
    setQuery(q);
    setCat(c);
  }, [searchParams]);

  useEffect(() => {
    let result = [...all];
    if (query) result = result.filter(c =>
      c.title.toLowerCase().includes(query) ||
      c.instructor.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query) ||
      c.tags.some(t => t.toLowerCase().includes(query))
    );
    if (cat !== 'all') result = result.filter(c => c.category === cat);
    if (level !== 'All Levels') result = result.filter(c => c.level === level);

    switch (sort) {
      case 'rating':     result.sort((a,b) => b.rating - a.rating);    break;
      case 'newest':     result.sort((a,b) => b.id - a.id);            break;
      case 'price_asc':  result.sort((a,b) => a.price - b.price);      break;
      case 'price_desc': result.sort((a,b) => b.price - a.price);      break;
      default:           result.sort((a,b) => b.students - a.students);
    }
    setShown(result);
  }, [all, query, cat, level, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (query) params.search = query;
    if (cat !== 'all') params.category = cat;
    setSearchParams(params);
  };

  const clearSearch = () => {
    setQuery('');
    setSearchParams(cat !== 'all' ? { category: cat } : {});
  };

  const handleCat = (c) => {
    setCat(c);
    const params = {};
    if (query) params.search = query;
    if (c !== 'all') params.category = c;
    setSearchParams(params);
  };

  return (
    <>
      {/* Page Header */}
      <section className="page-hero">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 text-center">
              <div className="section-eyebrow">Our Library</div>
              <h1 className="section-heading mb-2">Find your next course</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
                {all.length} premium courses taught by top industry experts
              </p>

              {/* Search bar */}
              <form onSubmit={handleSearch}>
                <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto' }}>
                  <FiSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '1rem' }} />
                  <input
                    type="text"
                    className="search-page-bar"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search by title, instructor, or topic..."
                    style={{ paddingLeft: '2.8rem', paddingRight: query ? '3rem' : '6rem' }}
                  />
                  {query && (
                    <button type="button" onClick={clearSearch}
                      style={{ position: 'absolute', right: 80, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                      <FiX />
                    </button>
                  )}
                  <button type="submit" className="btn-brand"
                    style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', padding: '0.48rem 1rem', fontSize: '0.83rem' }}>
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap">
        <div className="container">
          {/* Category Tabs */}
          <div className="filter-tabs mb-4">
            {CATEGORIES.map(c => (
              <button key={c.id} className={`filter-tab ${cat === c.id ? 'active' : ''}`} onClick={() => handleCat(c.id)}>
                {c.label}
              </button>
            ))}
          </div>

          {/* Sub-filters row */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div className="results-header">
              {query
                ? <span>Results for <strong>"{query}"</strong> — {shown.length} course{shown.length !== 1 ? 's' : ''} found</span>
                : <span>Showing <strong>{shown.length}</strong> courses</span>
              }
            </div>

            <div className="d-flex gap-2 align-items-center flex-wrap">
              {/* Level filter */}
              <div className="d-flex gap-1">
                {LEVELS.map(l => (
                  <button key={l} onClick={() => setLevel(l)}
                    style={{
                      background: level === l ? 'rgba(99,102,241,0.15)' : 'transparent',
                      border: `1px solid ${level === l ? 'var(--border-medium)' : 'var(--border-subtle)'}`,
                      color: level === l ? 'var(--brand-400)' : 'var(--text-muted)',
                      borderRadius: 50, padding: '0.3rem 0.9rem', fontSize: '0.78rem',
                      fontWeight: 500, cursor: 'pointer', transition: 'var(--transition)',
                    }}>
                    {l === 'All Levels' ? 'All' : l}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)', borderRadius: 8, padding: '0.38rem 0.75rem',
                  fontSize: '0.82rem', fontFamily: 'var(--font-body)', cursor: 'pointer',
                  outline: 'none',
                }}>
                {SORT_OPT.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Course Grid */}
          {loading ? (
            <div className="spinner-wrap"><div className="spinner-border spinner-brand" /></div>
          ) : shown.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <h4 className="empty-title">No courses found</h4>
              <p className="empty-subtitle">Try adjusting your search or filters</p>
              <button className="btn-brand mt-3" onClick={() => { setQuery(''); setCat('all'); setLevel('All Levels'); setSearchParams({}); }}>
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {shown.map((course, i) => (
                <div key={course.id} className={`col-12 col-sm-6 col-lg-3 anim-up delay-${Math.min(i % 4 + 1, 5)}`}>
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
