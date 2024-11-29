/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `Imovel` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Imovel_nome_key` ON `Imovel`(`nome`);
