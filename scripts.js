document.addEventListener('DOMContentLoaded', () => {
    // 슬라이더, 모달, 버튼 요소 선택
    const track = document.querySelector(".slider-track");
    const modal = document.querySelector(".modal");
    const modalImg = document.getElementById("modal-img");
    const captionText = document.getElementById("caption");
    const closeModalBtn = document.querySelector(".close-btn");
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const paginationDotsContainer = document.querySelector('.pagination-dots');
    const eventSection = document.querySelector('.event-section'); // 이벤트 섹션
    const pricingTable = document.querySelector('.pricing-section .pricing-table'); // 요금표 섹션
    const pricingTypeSelect = document.getElementById('pricing-type'); // 필터 드롭다운

    // 필수 요소들이 존재하는지 확인
    if (!track || !modal || !modalImg || !captionText || !closeModalBtn || !prevBtn || !nextBtn || !paginationDotsContainer || !pricingTable || !pricingTypeSelect) {
        console.error("필수 요소 중 일부를 찾을 수 없습니다. 스크립트를 종료합니다.");
        return; // 필수 요소가 없으면 코드 실행 중단
    }

    // 슬라이더 관련 변수 설정
    let position = 0;
    const slideWidth = 260;
    let speed = 0.5;
    let animationFrame;
    const slides = track.children.length / 2;

    // 슬라이더 트랙 복제
    track.innerHTML += track.innerHTML;

    // 페이지네이션 도트 생성
    for (let i = 0; i < slides; i++) {
        const dot = document.createElement('div');
        dot.dataset.index = i;
        paginationDotsContainer.appendChild(dot);
    }
    const dots = paginationDotsContainer.querySelectorAll('div');
    dots[0].classList.add('active');

    // 슬라이더 애니메이션 함수
    function animateSlider() {
        position -= speed;
        if (position <= -track.scrollWidth / 2) {
            position = 0;
        }
        track.style.transform = `translateX(${position}px)`;
        updatePagination();
        animationFrame = requestAnimationFrame(animateSlider);
    }

    // 슬라이더 애니메이션 시작
    animateSlider();

    // 애니메이션 일시 중지 함수
    function pauseAnimation() {
        cancelAnimationFrame(animationFrame);
    }

    // 애니메이션 재시작 함수
    function resumeAnimation() {
        animationFrame = requestAnimationFrame(animateSlider);
    }

    // 페이지네이션 업데이트 함수
    function updatePagination() {
        const currentIndex = Math.abs(Math.round(position / slideWidth)) % slides;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    }

    // 이전 버튼 클릭 이벤트 처리
    prevBtn.addEventListener('click', () => {
        pauseAnimation();
        position += slideWidth;
        if (position > 0) {
            position = -track.scrollWidth / 2 + slideWidth;
        }
        track.style.transform = `translateX(${position}px)`;
        updatePagination();
        setTimeout(resumeAnimation, 1000);
    });

    // 다음 버튼 클릭 이벤트 처리
    nextBtn.addEventListener('click', () => {
        pauseAnimation();
        position -= slideWidth;
        if (position <= -track.scrollWidth / 2) {
            position = 0;
        }
        track.style.transform = `translateX(${position}px)`;
        updatePagination();
        setTimeout(resumeAnimation, 1000);
    });

    // 페이지네이션 도트 클릭 이벤트
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            position = -index * slideWidth;
            track.style.transform = `translateX(${position}px)`;
            updatePagination();
            pauseAnimation();
            setTimeout(resumeAnimation, 1000);
        });
    });

    // 이미지 클릭 시 모달 창 열기
    track.addEventListener('click', (e) => {
        if (e.target && e.target.nodeName === 'IMG') {
            const img = e.target;
            modal.style.display = "block";
            modalImg.src = img.src;
            captionText.innerHTML = img.alt;
        }
    });

    // 모달 닫기 버튼 클릭 시 모달 닫기
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = "none";
    });

    // 모달 외부를 클릭했을 때 모달 닫기
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // 'Esc' 키를 눌렀을 때 모달 닫기
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            modal.style.display = "none";
        }
    });

    // 기본 행 길이 설정
    const defaultRowCount = 10;

    // 빈 행을 추가해 표의 길이를 고정하는 함수
    function addEmptyRows() {
        const tbody = pricingTable.querySelector('tbody');
        const currentRowCount = tbody.querySelectorAll('tr').length;

        if (currentRowCount < defaultRowCount) {
            for (let i = currentRowCount; i < defaultRowCount; i++) {
                const emptyRow = document.createElement('tr');
                emptyRow.innerHTML = '<td colspan="3">&nbsp;</td>';
                tbody.appendChild(emptyRow);
            }
        }
    }

    // 요금표 필터링 기능
    const pricingRows = pricingTable.querySelectorAll('tbody tr');

    pricingTypeSelect.addEventListener('change', () => {
        const selectedType = pricingTypeSelect.value;

        pricingRows.forEach(row => {
            if (selectedType === 'all' || row.dataset.type === selectedType) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });

        // 이벤트 섹션 행들을 필터링에서 제외
        const eventRows = eventSection.querySelectorAll('tbody tr');
        eventRows.forEach(row => {
            row.style.display = ''; // 항상 표시
        });

        // 필터링 후 빈 행 추가
        addEmptyRows();
    });

    // 페이지가 로드될 때 기본 필터 적용
    pricingTypeSelect.dispatchEvent(new Event('change'));
});
