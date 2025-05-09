'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { deleteAllRecipes } from '@/lib/utils/recipeApi';
import { useToast } from '@/components/ui/use-toast';
import SidebarLayout from '@/components/layout/SidebarLayout';

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDeleteAllRecipes = async () => {
    try {
      setIsLoading(true);
      const result = await deleteAllRecipes();
      toast({
        title: "성공",
        description: result.message,
      });
    } catch (error) {
      toast({
        title: "오류",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">관리자 대시보드</h1>
        
        <Tabs defaultValue="recipes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="recipes">레시피 관리</TabsTrigger>
            <TabsTrigger value="users">사용자 관리</TabsTrigger>
            <TabsTrigger value="settings">시스템 설정</TabsTrigger>
          </TabsList>

          <TabsContent value="recipes">
            <Card>
              <CardHeader>
                <CardTitle>레시피 관리</CardTitle>
                <CardDescription>
                  레시피 데이터를 관리하고 조작할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">전체 레시피 삭제</h3>
                      <p className="text-sm text-muted-foreground">
                        데이터베이스의 모든 레시피를 삭제합니다. 이 작업은 되돌릴 수 없습니다.
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={isLoading}>
                          {isLoading ? "삭제 중..." : "전체 삭제"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>정말로 모든 레시피를 삭제하시겠습니까?</AlertDialogTitle>
                          <AlertDialogDescription>
                            이 작업은 되돌릴 수 없으며, 모든 레시피 데이터가 영구적으로 삭제됩니다.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>취소</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteAllRecipes}>
                            삭제
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>사용자 관리</CardTitle>
                <CardDescription>
                  사용자 계정을 관리하고 권한을 설정할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">사용자 관리 기능은 준비 중입니다.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>시스템 설정</CardTitle>
                <CardDescription>
                  시스템 설정을 관리하고 구성할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">시스템 설정 기능은 준비 중입니다.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
} 