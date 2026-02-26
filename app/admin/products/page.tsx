"use client";

import { useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const products = [
  {
    id: 1,
    name: "21기 AI 자동화 스터디",
    regular: "200,000원",
    earlyBird: "150,000원",
    superEarlyBird: "130,000원",
    deadline: "2026.03.10",
    status: "판매중",
  },
  {
    id: 2,
    name: "21기 프롬프트 엔지니어링",
    regular: "160,000원",
    earlyBird: "120,000원",
    superEarlyBird: "100,000원",
    deadline: "2026.03.15",
    status: "판매중",
  },
  {
    id: 3,
    name: "21기 ChatGPT 실무 활용",
    regular: "130,000원",
    earlyBird: "100,000원",
    superEarlyBird: "80,000원",
    deadline: "2026.03.01",
    status: "판매중",
  },
  {
    id: 4,
    name: "21기 n8n 자동화 마스터",
    regular: "170,000원",
    earlyBird: "130,000원",
    superEarlyBird: "110,000원",
    deadline: "2026.02.25",
    status: "마감",
  },
  {
    id: 5,
    name: "20기 AI 디자인 스터디",
    regular: "140,000원",
    earlyBird: "110,000원",
    superEarlyBird: "90,000원",
    deadline: "2026.01.10",
    status: "판매중지",
  },
];

const couponList = [
  {
    id: 1,
    code: "EARLY21",
    type: "정률",
    discount: "30%",
    used: 8,
    limit: 50,
    expiry: "2026.03.10",
    status: "활성",
  },
  {
    id: 2,
    code: "VIP2026",
    type: "정액",
    discount: "20,000원",
    used: 3,
    limit: 10,
    expiry: "2026.06.30",
    status: "활성",
  },
  {
    id: 3,
    code: "PROMPT10",
    type: "정률",
    discount: "10%",
    used: 2,
    limit: 20,
    expiry: "2026.03.15",
    status: "활성",
  },
  {
    id: 4,
    code: "WELCOME",
    type: "정액",
    discount: "10,000원",
    used: 45,
    limit: 100,
    expiry: "2026.12.31",
    status: "활성",
  },
  {
    id: 5,
    code: "SUMMER25",
    type: "정률",
    discount: "15%",
    used: 30,
    limit: 30,
    expiry: "2025.08.31",
    status: "만료",
  },
];

const tabItems = [
  { key: "products", label: "상품" },
  { key: "coupons", label: "쿠폰" },
];

export default function AdminProductsPage() {
  const [activeTab, setActiveTab] = useState("products");
  const [productSearch, setProductSearch] = useState("");
  const [couponSearch, setCouponSearch] = useState("");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredCoupons = couponList.filter((c) =>
    c.code.toLowerCase().includes(couponSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">상품/쿠폰 관리</h1>
        <Button size="sm">
          <Plus className="w-4 h-4" />
          {activeTab === "products" ? "새 상품" : "새 쿠폰"}
        </Button>
      </div>

      <Tabs
        items={tabItems}
        activeKey={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Products Tab */}
      {activeTab === "products" && (
        <div className="space-y-4">
          <Input
            placeholder="상품명 검색..."
            icon={<Search className="w-4 h-4" />}
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
          />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>스터디명</TableHead>
                <TableHead className="whitespace-nowrap">정상가</TableHead>
                <TableHead className="whitespace-nowrap">얼리버드</TableHead>
                <TableHead className="whitespace-nowrap hidden sm:table-cell">
                  슈퍼얼리버드
                </TableHead>
                <TableHead className="whitespace-nowrap hidden md:table-cell">
                  마감일
                </TableHead>
                <TableHead className="whitespace-nowrap">상태</TableHead>
                <TableHead className="whitespace-nowrap">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <span className="text-foreground font-medium">
                      {product.name}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {product.regular}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {product.earlyBird}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground hidden sm:table-cell">
                    {product.superEarlyBird}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground hidden md:table-cell">
                    {product.deadline}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === "판매중"
                          ? "active"
                          : product.status === "마감"
                            ? "default"
                            : "completed"
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredProducts.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              검색 결과가 없습니다.
            </p>
          )}
        </div>
      )}

      {/* Coupons Tab */}
      {activeTab === "coupons" && (
        <div className="space-y-4">
          <Input
            placeholder="쿠폰 코드 검색..."
            icon={<Search className="w-4 h-4" />}
            value={couponSearch}
            onChange={(e) => setCouponSearch(e.target.value)}
          />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>코드</TableHead>
                <TableHead className="whitespace-nowrap">할인타입</TableHead>
                <TableHead className="whitespace-nowrap">할인</TableHead>
                <TableHead className="whitespace-nowrap">사용량</TableHead>
                <TableHead className="whitespace-nowrap hidden sm:table-cell">
                  유효기간
                </TableHead>
                <TableHead className="whitespace-nowrap">상태</TableHead>
                <TableHead className="whitespace-nowrap">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCoupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <span className="font-mono text-foreground font-medium">
                      {coupon.code}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {coupon.type}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {coupon.discount}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {coupon.used}/{coupon.limit}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground hidden sm:table-cell">
                    ~{coupon.expiry}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={coupon.status === "활성" ? "active" : "default"}
                    >
                      {coupon.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredCoupons.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              검색 결과가 없습니다.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
