import { Skeleton } from "antd";
import styled, { keyframes } from "styled-components";

// Props interface for customization
export const SkeletonTable = ({
  rows = 6,
  columns = 8,
  headerHeight = 56,
  rowHeight = 53,
  columnWidths = [150, 120, 120, 100, 120, 130, 100, 120],
}) => {
  return (
    <TableContainer>
      <SkeletonWrapper>
        {/* Header skeleton */}
        <SkeletonHeader height={headerHeight}>
          {Array(columns)
            .fill(null)
            .map((_, index) => (
              <HeaderCell key={`header-${index}`}>
                <Skeleton.Button
                  active
                  size="small"
                  style={{
                    width: columnWidths[index] || 120,
                    borderRadius: "4px",
                    height: "24px",
                  }}
                />
              </HeaderCell>
            ))}
        </SkeletonHeader>

        {/* Rows skeleton */}
        <SkeletonBody>
          {Array(rows)
            .fill(null)
            .map((_, rowIndex) => (
              <SkeletonRow key={`row-${rowIndex}`} height={rowHeight}>
                {Array(columns)
                  .fill(null)
                  .map((_, colIndex) => (
                    <RowCell key={`cell-${rowIndex}-${colIndex}`}>
                      <ShimmerWrapper>
                        <Skeleton.Button
                          active
                          size="small"
                          style={{
                            width: columnWidths[colIndex]
                              ? columnWidths[colIndex] * 0.8
                              : 100,
                            borderRadius: "4px",
                            height: colIndex === 0 ? "22px" : "18px",
                            opacity: 0.85,
                          }}
                        />
                        <Shimmer />
                      </ShimmerWrapper>
                    </RowCell>
                  ))}
              </SkeletonRow>
            ))}
        </SkeletonBody>

        {/* Pagination skeleton */}
        <SkeletonFooter>
          <ShimmerWrapper>
            <Skeleton.Button
              active
              size="small"
              style={{ width: 80, height: 24, borderRadius: "4px" }}
            />
            <Shimmer />
          </ShimmerWrapper>
          <PaginationButtons>
            {Array(5)
              .fill(null)
              .map((_, index) => (
                <ShimmerWrapper key={`page-${index}`}>
                  <Skeleton.Button
                    active
                    size="small"
                    style={{
                      width: index === 2 ? 32 : 28,
                      height: 28,
                      borderRadius: "4px",
                      opacity: index === 2 ? 1 : 0.7,
                    }}
                  />
                  <Shimmer />
                </ShimmerWrapper>
              ))}
          </PaginationButtons>
        </SkeletonFooter>
      </SkeletonWrapper>
    </TableContainer>
  );
};

// Animation for shimmer effect
const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

// Styled components with improved aesthetics
const TableContainer = styled.div`
  width: 100%;
  overflow: hidden;
  margin: 16px 0;
`;

const SkeletonWrapper = styled.div`
  width: 100%;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  background-color: white;
`;

const SkeletonHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 0 16px;
  background-color: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  height: ${(props) => props.height}px;
`;

const HeaderCell = styled.div`
  padding: 8px 8px 8px 0;
  display: flex;
  align-items: center;
`;

const SkeletonBody = styled.div`
  max-height: 400px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #e0e0e0;
    border-radius: 3px;
  }
`;

const SkeletonRow = styled.div`
  display: flex;
  align-items: center;
  height: ${(props) => props.height}px;
  padding: 0 16px;
  border-bottom: 1px solid #f0f0f0;

  &:hover {
    background-color: #fafafa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const RowCell = styled.div`
  padding: 8px 8px 8px 0;
  display: flex;
  align-items: center;
`;

const SkeletonFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-top: 1px solid #f0f0f0;
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ShimmerWrapper = styled.div`
  position: relative;
  overflow: hidden;
`;

const Shimmer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.6) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: ${shimmer} 1.5s infinite;
`;
