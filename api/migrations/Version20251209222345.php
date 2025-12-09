<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251209222345 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE icon ADD material_icon_name VARCHAR(50) DEFAULT NULL');
        $this->addSql('ALTER TABLE icon ADD CONSTRAINT FK_659429DB727ACA70 FOREIGN KEY (parent_id) REFERENCES icon (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE icon ADD CONSTRAINT FK_659429DBA76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE icon DROP FOREIGN KEY FK_659429DB727ACA70');
        $this->addSql('ALTER TABLE icon DROP FOREIGN KEY FK_659429DBA76ED395');
        $this->addSql('ALTER TABLE icon DROP material_icon_name');
    }
}
